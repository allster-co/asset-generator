/**
 * Template Registry
 * 
 * Maps template keys to React components.
 */

import { CertificateA4 } from './certificate-a4';
import { SocialSquare } from './social-square';
import { SocialStory } from './social-story';
import { Display16x9 } from './display-16x9';

export type TemplateComponent = (props: Record<string, unknown>) => JSX.Element;

export const templates: Record<string, TemplateComponent> = {
  'certificate-a4': CertificateA4,
  'social-square': SocialSquare,
  'social-story': SocialStory,
  'display-16x9': Display16x9,
};

/**
 * Default templates to generate for each award.
 */
export const DEFAULT_TEMPLATES = [
  { key: 'certificate-a4', version: 1, variant: 'A4', format: 'PDF' as const },
  { key: 'social-square', version: 1, variant: '1080x1080', format: 'PNG' as const },
  { key: 'social-story', version: 1, variant: '1080x1920', format: 'PNG' as const },
  { key: 'display-16x9', version: 1, variant: '1920x1080', format: 'PNG' as const },
];
