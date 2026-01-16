/**
 * Playwright Renderer
 * 
 * Renders React templates to PNG/PDF using headless Chromium.
 * Stateless - returns binary buffer with metadata, no storage/DB operations.
 */

import { chromium, Browser } from 'playwright';
import { renderToStaticMarkup } from 'react-dom/server';
import crypto from 'crypto';
import { getTemplate, hasTemplate, hasTemplateVersion, getTemplateVersions } from './templates';
import { RenderResult, isValidPngVariant, VALID_PDF_VARIANTS } from './types';

let browser: Browser | null = null;
let browserLaunchInProgress: Promise<Browser> | null = null;

// Track consecutive browser crashes for circuit breaker
let consecutiveBrowserCrashes = 0;
const MAX_CONSECUTIVE_CRASHES = 3;
const CRASH_WINDOW_MS = 60_000; // Reset counter if no crashes for 1 minute
let lastCrashTime = 0;

// Pattern to detect browser crash errors
const BROWSER_CRASH_PATTERNS = [
  /Target.*closed/i,
  /browser.*closed/i,
  /page.*closed/i,
  /context.*closed/i,
  /crashed/i,
  /disconnected/i,
];

function isBrowserCrashError(error: Error): boolean {
  return BROWSER_CRASH_PATTERNS.some(pattern => pattern.test(error.message));
}

function recordBrowserCrash(): void {
  const now = Date.now();
  
  // Reset counter if it's been a while since last crash
  if (now - lastCrashTime > CRASH_WINDOW_MS) {
    consecutiveBrowserCrashes = 0;
  }
  
  consecutiveBrowserCrashes++;
  lastCrashTime = now;
  
  console.error(`[renderer] Browser crash recorded (${consecutiveBrowserCrashes}/${MAX_CONSECUTIVE_CRASHES} in window)`);
  
  // If we've had too many crashes, exit the process so Render.com can restart us fresh
  if (consecutiveBrowserCrashes >= MAX_CONSECUTIVE_CRASHES) {
    console.error('[renderer] FATAL: Too many consecutive browser crashes, exiting process for restart...');
    // Give time for logs to flush
    setTimeout(() => process.exit(1), 1000);
  }
}

function recordBrowserSuccess(): void {
  // Reset crash counter on successful render
  if (consecutiveBrowserCrashes > 0) {
    console.log(`[renderer] Browser recovered, resetting crash counter (was ${consecutiveBrowserCrashes})`);
    consecutiveBrowserCrashes = 0;
  }
}

async function getBrowser(): Promise<Browser> {
  // If browser exists and is still connected, return it
  if (browser && browser.isConnected()) {
    return browser;
  }
  
  // Browser is dead or null - need to (re)launch
  if (browser) {
    console.log('[renderer] Browser disconnected, will relaunch...');
    browser = null;
  }
  
  // If a launch is already in progress, wait for it
  if (browserLaunchInProgress) {
    console.log('[renderer] Browser launch already in progress, waiting...');
    return browserLaunchInProgress;
  }
  
  console.log('[renderer] Launching browser...');
  browserLaunchInProgress = chromium.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
    ],
  });
  
  try {
    browser = await browserLaunchInProgress;
    console.log('[renderer] Browser launched successfully');
    
    // Listen for unexpected disconnects
    browser.on('disconnected', () => {
      console.error('[renderer] Browser disconnected unexpectedly!');
      browser = null;
    });
    
    return browser;
  } catch (error) {
    console.error('[renderer] Failed to launch browser:', error);
    throw error;
  } finally {
    browserLaunchInProgress = null;
  }
}

export interface RenderOptions {
  templateKey: string;
  templateVersion: number;
  variant: string;
  format: 'PNG' | 'PDF';
  payload: Record<string, unknown>;
}

export class RenderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RenderValidationError';
  }
}

/**
 * Validate render options before rendering.
 * Throws RenderValidationError if invalid.
 */
export function validateRenderOptions(options: RenderOptions): void {
  const { templateKey, templateVersion, variant, format } = options;

  // Validate template key exists
  if (!hasTemplate(templateKey)) {
    throw new RenderValidationError(
      `Unknown template: ${templateKey}. Available: certificate-a4, social-square, social-post, display-16x9, rosette-award`
    );
  }

  // Validate template version exists
  if (!hasTemplateVersion(templateKey, templateVersion)) {
    const versions = getTemplateVersions(templateKey);
    throw new RenderValidationError(
      `Unsupported version ${templateVersion} for template ${templateKey}. Available versions: ${versions.join(', ')}`
    );
  }

  // Validate format
  if (format !== 'PNG' && format !== 'PDF') {
    throw new RenderValidationError(`Invalid format: ${format}. Must be PNG or PDF`);
  }

  // Validate variant matches format
  if (format === 'PNG') {
    // PNG supports any WIDTHxHEIGHT dimensions (e.g., 1080x1080, 1200x630, 500x500)
    if (!isValidPngVariant(variant)) {
      throw new RenderValidationError(
        `Invalid PNG variant: ${variant}. Must be in WIDTHxHEIGHT format (e.g., 1080x1080, 1200x630, 500x500). Dimensions must be between 10 and 10000 pixels.`
      );
    }
  } else {
    // For PDF, allow standard variants (A4, A5) or custom dimensions (e.g., 1080x1080)
    const isStandardVariant = VALID_PDF_VARIANTS.includes(variant as typeof VALID_PDF_VARIANTS[number]);
    const isCustomDimensions = /^\d+x\d+$/.test(variant);
    
    if (!isStandardVariant && !isCustomDimensions) {
      throw new RenderValidationError(
        `Invalid PDF variant: ${variant}. Must be one of: ${VALID_PDF_VARIANTS.join(', ')} or custom dimensions (e.g., 1080x1080)`
      );
    }
  }
}

/**
 * Render a template to PNG or PDF.
 * Returns buffer with content hash and metadata.
 * Includes automatic recovery from browser crashes.
 */
export async function render(options: RenderOptions): Promise<RenderResult> {
  const { templateKey, templateVersion, variant, format, payload } = options;

  console.log(`[renderer] Starting render: ${templateKey} ${variant} ${format}`);

  // Validate options (throws if invalid)
  validateRenderOptions(options);

  const Template = getTemplate(templateKey, templateVersion)!;

  // Render React component to HTML string
  console.log('[renderer] Rendering React component to HTML...');
  const html = renderToStaticMarkup(Template(payload));
  console.log(`[renderer] HTML generated: ${html.length} bytes`);

  // Try to get browser and create page, with crash recovery
  console.log('[renderer] Getting browser...');
  let browserInstance: Browser;
  try {
    browserInstance = await getBrowser();
  } catch (error) {
    if (isBrowserCrashError(error as Error)) {
      console.error('[renderer] Browser crashed during getBrowser, resetting state...');
      recordBrowserCrash();
      browser = null;
      browserLaunchInProgress = null;
      // Retry once after resetting
      browserInstance = await getBrowser();
    } else {
      throw error;
    }
  }
  
  console.log('[renderer] Creating new page...');
  let page;
  try {
    page = await browserInstance.newPage();
  } catch (error) {
    if (isBrowserCrashError(error as Error)) {
      console.error('[renderer] Browser crashed during newPage, resetting and retrying...');
      recordBrowserCrash();
      browser = null;
      browserLaunchInProgress = null;
      // Retry once with fresh browser
      browserInstance = await getBrowser();
      page = await browserInstance.newPage();
    } else {
      throw error;
    }
  }

  let width: number | undefined;
  let height: number | undefined;

  try {
    // PNG: Set viewport BEFORE setContent
    if (format === 'PNG') {
      const dims = variant.split('x').map(Number);
      [width, height] = dims;
      await page.setViewportSize({ width, height });
    }
    
    // PDF with custom dimensions: Set viewport BEFORE setContent
    if (format === 'PDF' && variant.includes('x')) {
      const dims = variant.split('x').map(Number);
      [width, height] = dims;
      await page.setViewportSize({ width, height });
    }

    // Load content
    await page.setContent(html, { waitUntil: 'networkidle' });

    // Wait for render-ready flag
    await page.waitForSelector('[data-render-ready="1"]', { timeout: 10000 });

    // Wait for fonts to be ready
    await page.evaluate(() => document.fonts.ready);

    // Wait for all images to load
    await page.evaluate(() => {
      const images = Array.from(document.images);
      return Promise.all(
        images.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Image failed to load: ${img.src.slice(0, 100)}`));
          });
        })
      );
    });

    let buffer: Buffer;
    let mimeType: string;

    console.log(`[renderer] Generating ${format}...`);

    if (format === 'PDF') {
      // PDF: format from variant (A4, A5, etc.) or custom dimensions
      if (variant === 'CUSTOM' || variant.includes('x')) {
        // Custom dimensions - use the viewport size set earlier or parse from variant
        let pdfWidth = width;
        let pdfHeight = height;
        
        if (variant.includes('x')) {
          const dims = variant.split('x').map(Number);
          [pdfWidth, pdfHeight] = dims;
        }
        
        buffer = await page.pdf({
          width: `${pdfWidth}px`,
          height: `${pdfHeight}px`,
          printBackground: true,
        });
      } else {
        const pdfFormat = variant.toUpperCase() as 'A4' | 'A5';
        buffer = await page.pdf({
          format: pdfFormat,
          printBackground: true,
        });
      }
      mimeType = 'application/pdf';
    } else {
      buffer = await page.screenshot({ type: 'png', omitBackground: true });
      mimeType = 'image/png';
    }

    // Compute content hash (SHA-256)
    const contentHash = crypto.createHash('sha256').update(buffer).digest('hex');

    console.log(`[renderer] Render complete: ${buffer.length} bytes, hash=${contentHash.slice(0, 12)}...`);

    // Record successful render (resets crash counter)
    recordBrowserSuccess();

    return { buffer, contentHash, mimeType, width, height };
  } catch (error) {
    console.error('[renderer] Render failed:', error);
    
    // If this is a browser crash, record it and reset state
    if (isBrowserCrashError(error as Error)) {
      console.error('[renderer] Browser crash detected during render, resetting browser state...');
      recordBrowserCrash();
      browser = null;
      browserLaunchInProgress = null;
    }
    
    throw error;
  } finally {
    // Safely close page if it exists
    if (page) {
      try {
        console.log('[renderer] Closing page...');
        await page.close();
      } catch (closeError) {
        // Page might already be closed if browser crashed
        console.log('[renderer] Page close failed (likely already closed):', (closeError as Error).message);
      }
    }
    
    // Force garbage collection hint by closing browser after each render
    // This helps prevent memory buildup on memory-constrained containers
    if (browser && browser.isConnected()) {
      try {
        console.log('[renderer] Closing browser to free memory...');
        await browser.close();
      } catch (closeError) {
        console.log('[renderer] Browser close failed:', (closeError as Error).message);
      }
      browser = null;
    }
  }
}

/**
 * Close the browser instance (for graceful shutdown)
 */
export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
    console.log('[renderer] Browser closed');
  }
}
