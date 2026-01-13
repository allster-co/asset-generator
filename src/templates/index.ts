/**
 * Template Registry
 * 
 * Maps templateKey -> version -> React component.
 * Supports versioning for future template iterations.
 */

import React from 'react';
import { CertificateA4 } from './certificate-a4';
import { SocialSquare } from './social-square';
import { SocialPost } from './social-post';
import { Display16x9 } from './display-16x9';
import { RosetteAward } from './rosette-award';

export type TemplateComponent = (props: Record<string, unknown>) => React.ReactElement;

/**
 * Versioned template registry.
 * Structure: templates[templateKey][version] = Component
 */
export const templates: Record<string, Record<number, TemplateComponent>> = {
  'certificate-a4': {
    1: CertificateA4,
  },
  'social-square': {
    1: SocialSquare,
  },
  'social-post': {
    1: SocialPost,
  },
  'display-16x9': {
    1: Display16x9,
  },
  'rosette-award': {
    1: RosetteAward,
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
