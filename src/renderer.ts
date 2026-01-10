/**
 * Playwright Renderer
 * 
 * Renders React templates to PNG/PDF using headless Chromium.
 */

import { chromium, Browser } from 'playwright';
import { renderToStaticMarkup } from 'react-dom/server';
import crypto from 'crypto';
import { templates } from './templates';

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
  variant: string;       // "1080x1080" | "A4" | "A5" | "1920x1080"
  format: 'PNG' | 'PDF';
  payload: Record<string, unknown>;
}

export interface RenderResult {
  buffer: Buffer;
  contentHash: string;
  mimeType: string;
  width?: number;
  height?: number;
}

export async function render(options: RenderOptions): Promise<RenderResult> {
  const { templateKey, variant, format, payload } = options;

  const Template = templates[templateKey];
  if (!Template) {
    throw new Error(`Unknown template: ${templateKey}`);
  }

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
      if (dims.length !== 2 || dims.some(isNaN)) {
        throw new Error(`Invalid PNG variant: ${variant}`);
      }
      [width, height] = dims;
      await page.setViewportSize({ width, height });
    }

    // Load content
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    // Wait for render-ready flag
    await page.waitForSelector('[data-render-ready="1"]', { timeout: 10000 });

    // Wait for fonts
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
      const pdfFormat = variant.toUpperCase() as 'A4' | 'A5' | 'LETTER';
      buffer = await page.pdf({
        format: pdfFormat,
        printBackground: true,
      });
      mimeType = 'application/pdf';
    } else {
      buffer = await page.screenshot({ type: 'png' });
      mimeType = 'image/png';
    }

    // Compute content hash
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
