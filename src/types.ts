/**
 * Shared Types for Asset Renderer
 */

export type TemplateKey = 
  | 'certificate-a4'
  | 'social-square'
  | 'social-post'
  | 'display-16x9'
  | 'rosette-award';

export type RenderFormat = 'PNG' | 'PDF';

// Common presets for reference, but any WIDTHxHEIGHT is supported
export type PngVariantPreset = '1080x1080' | '1080x1350' | '1080x1920' | '1920x1080' | '800x800' | '1200x630' | '500x500';
export type PdfVariant = 'A4' | 'A5';
// PNG variant can be any WIDTHxHEIGHT string, PDF can be standard paper sizes or custom dimensions
export type Variant = string;

export interface RenderRequest {
  templateKey: string;
  templateVersion: number;
  format: RenderFormat;
  variant: string;
  payload: Record<string, unknown>;
}

export interface RenderResult {
  buffer: Buffer;
  contentHash: string;
  mimeType: string;
  width?: number;
  height?: number;
}

export interface RenderResponseHeaders {
  'content-type': string;
  'x-content-hash': string;
  'x-byte-size': string;
  'x-mime-type': string;
  'x-template-key': string;
  'x-template-version': string;
  'x-variant': string;
  'x-width'?: string;
  'x-height'?: string;
}

export interface ApiError {
  error: 'invalid_request' | 'unauthorized' | 'render_failed';
  message: string;
  requestId?: string;
}

// Preset PNG variants for documentation/reference (any WIDTHxHEIGHT is supported)
export const PNG_VARIANT_PRESETS: PngVariantPreset[] = ['1080x1080', '1080x1350', '1080x1920', '1920x1080', '800x800', '1200x630', '500x500'];
export const VALID_PDF_VARIANTS: PdfVariant[] = ['A4', 'A5'];

/**
 * Validates that a PNG variant is in WIDTHxHEIGHT format with reasonable dimensions.
 * Returns true if valid, false otherwise.
 */
export function isValidPngVariant(variant: string): boolean {
  const match = variant.match(/^(\d+)x(\d+)$/);
  if (!match) return false;
  
  const width = parseInt(match[1], 10);
  const height = parseInt(match[2], 10);
  
  // Reasonable bounds: minimum 10px, maximum 10000px
  return width >= 10 && width <= 10000 && height >= 10 && height <= 10000;
}
