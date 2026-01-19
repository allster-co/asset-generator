/**
 * Template Registry
 * 
 * Maps templateKey -> version -> React component.
 * Supports versioning for future template iterations.
 */

import React from 'react';
import { CertificateA4 } from './certificate-a4';
import { CertificateA4NoWatermark } from './certificate-a4-no-watermark';
import { SocialSquare } from './social-square';
import { SocialSquareNoWatermark } from './social-square-no-watermark';
import { SocialPost } from './social-post';
import { SocialPostNoWatermark } from './social-post-no-watermark';
import { Display16x9 } from './display-16x9';
import { Display16x9NoWatermark } from './display-16x9-no-watermark';
import { RosetteAward } from './rosette-award';
import { RosetteAwardNoWatermark } from './rosette-award-no-watermark';

export type TemplateComponent = (props: Record<string, unknown>) => React.ReactElement;

/**
 * Versioned template registry.
 * Structure: templates[templateKey][version] = Component
 */
export const templates: Record<string, Record<number, TemplateComponent>> = {
  'certificate-a4': {
    1: CertificateA4,
  },
  'certificate-a4-no-watermark': {
    1: CertificateA4NoWatermark,
  },
  'social-square': {
    1: SocialSquare,
  },
  'social-square-no-watermark': {
    1: SocialSquareNoWatermark,
  },
  'social-post': {
    1: SocialPost,
  },
  'social-post-no-watermark': {
    1: SocialPostNoWatermark,
  },
  'display-16x9': {
    1: Display16x9,
  },
  'display-16x9-no-watermark': {
    1: Display16x9NoWatermark,
  },
  'rosette-award': {
    1: RosetteAward,
  },
  'rosette-award-no-watermark': {
    1: RosetteAwardNoWatermark,
  },
};

/**
 * Get a template component by key and version.
 * Returns undefined if not found.
 */
export function getTemplate(templateKey: string, version: number): TemplateComponent | undefined {
  return templates[templateKey]?.[version];
}

/**
 * Check if a template key exists (any version).
 */
export function hasTemplate(templateKey: string): boolean {
  return templateKey in templates;
}

/**
 * Check if a specific template version exists.
 */
export function hasTemplateVersion(templateKey: string, version: number): boolean {
  return templates[templateKey]?.[version] !== undefined;
}

/**
 * Get all available template keys.
 */
export function getTemplateKeys(): string[] {
  return Object.keys(templates);
}

/**
 * Get available versions for a template.
 */
export function getTemplateVersions(templateKey: string): number[] {
  const versions = templates[templateKey];
  return versions ? Object.keys(versions).map(Number) : [];
}
