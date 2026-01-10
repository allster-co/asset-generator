/**
 * Shared Types for Asset Renderer
 */

export type TemplateKey = 
  | 'certificate-a4'
  | 'social-square'
  | 'social-story'
  | 'display-16x9';

export type RenderFormat = 'PNG' | 'PDF';

export type PngVariant = '1080x1080' | '1080x1920' | '1920x1080';
export type PdfVariant = 'A4' | 'A5';
export type Variant = PngVariant | PdfVariant;

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

export const VALID_PNG_VARIANTS: PngVariant[] = ['1080x1080', '1080x1920', '1920x1080'];
export const VALID_PDF_VARIANTS: PdfVariant[] = ['A4', 'A5'];
