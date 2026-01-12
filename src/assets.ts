/**
 * Asset Loading
 * 
 * Load static assets (images, fonts) as base64 data URIs.
 * This allows templates to embed assets directly in HTML
 * when using page.setContent().
 */

import fs from 'fs';
import path from 'path';

// Resolve from project root, works in both src/ and dist/
const ASSETS_DIR = path.join(process.cwd(), 'assets');

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

/**
 * Convert a file to a data URI.
 */
function toDataUri(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME_TYPES[ext] || 'application/octet-stream';
  const data = fs.readFileSync(filePath);
  return `data:${mime};base64,${data.toString('base64')}`;
}

/**
 * Load a font file as a data URI.
 */
function loadFont(fontFile: string): string {
  const fontPath = path.join(ASSETS_DIR, 'fonts', fontFile);
  if (!fs.existsSync(fontPath)) {
    console.warn(`[assets] Font not found: ${fontPath}`);
    return '';
  }
  return toDataUri(fontPath);
}

/**
 * Load an asset file as a data URI.
 */
function loadAsset(assetFile: string): string {
  const assetPath = path.join(ASSETS_DIR, assetFile);
  if (!fs.existsSync(assetPath)) {
    console.warn(`[assets] Asset not found: ${assetPath}`);
    return '';
  }
  return toDataUri(assetPath);
}

/**
 * Pre-loaded assets as data URIs.
 * Add new assets here as needed.
 */
export const assets = {
  // Images
  backgroundFrame: loadAsset('background-frame.png'),
  goldRosette: loadAsset('gold-award-rosette.png'),
  silverRosette: loadAsset('silver-rosette-award.svg'),
  bronzeRosette: loadAsset('bronze-rosette-award.svg'),
  greenRosette: loadAsset('green-rosette-award.svg'),
  divider: loadAsset('divider.svg'),
  logo: loadAsset('logo.svg'),
  watermarkOverlay: loadAsset('watermark-overlay.png'),

  // Fonts (add actual font files when available)
  fonts: {
    // Example: playfairBold: loadFont('PlayfairDisplay-Bold.woff2'),
  },
};

/**
 * Generate CSS for embedded fonts.
 */
export function getFontFaceCSS(): string {
  // Add @font-face declarations as fonts are added
  return '';
}
