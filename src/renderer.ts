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
import { RenderResult, VALID_PNG_VARIANTS, VALID_PDF_VARIANTS } from './types';

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    console.log('[renderer] Browser launched');
  }
  return browser;
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
      `Unknown template: ${templateKey}. Available: certificate-a4, social-square, social-story, display-16x9`
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
    if (!VALID_PNG_VARIANTS.includes(variant as typeof VALID_PNG_VARIANTS[number])) {
      throw new RenderValidationError(
        `Invalid PNG variant: ${variant}. Must be one of: ${VALID_PNG_VARIANTS.join(', ')}`
      );
    }
  } else {
    if (!VALID_PDF_VARIANTS.includes(variant as typeof VALID_PDF_VARIANTS[number])) {
      throw new RenderValidationError(
        `Invalid PDF variant: ${variant}. Must be one of: ${VALID_PDF_VARIANTS.join(', ')}`
      );
    }
  }
}

/**
 * Render a template to PNG or PDF.
 * Returns buffer with content hash and metadata.
 */
export async function render(options: RenderOptions): Promise<RenderResult> {
  const { templateKey, templateVersion, variant, format, payload } = options;

  // Validate options (throws if invalid)
  validateRenderOptions(options);

  const Template = getTemplate(templateKey, templateVersion)!;

  // Render React component to HTML string
  const html = renderToStaticMarkup(Template(payload));

  const browser = await getBrowser();
  const page = await browser.newPage();

  let width: number | undefined;
  let height: number | undefined;

  try {
    // PNG: Set viewport BEFORE setContent
    if (format === 'PNG') {
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

    if (format === 'PDF') {
      // PDF: format from variant (A4, A5, etc.)
      const pdfFormat = variant.toUpperCase() as 'A4' | 'A5';
      buffer = await page.pdf({
        format: pdfFormat,
        printBackground: true,
      });
      mimeType = 'application/pdf';
    } else {
      buffer = await page.screenshot({ type: 'png' });
      mimeType = 'image/png';
    }

    // Compute content hash (SHA-256)
    const contentHash = crypto.createHash('sha256').update(buffer).digest('hex');

    return { buffer, contentHash, mimeType, width, height };
  } finally {
    await page.close();
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
