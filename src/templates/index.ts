/**
 * Template Registry
 * 
 * Maps template keys to React components.
 */

import { CertificateA4 } from './certificate-a4';
// Import other templates as they are created
// import { SocialSquare } from './social-square';
// import { SocialStory } from './social-story';
// import { Display16x9 } from './display-16x9';

export type TemplateComponent = (props: Record<string, unknown>) => JSX.Element;

export const templates: Record<string, TemplateComponent> = {
  'certificate-a4': CertificateA4,
  // Add other templates here:
  // 'social-square': SocialSquare,
  // 'social-story': SocialStory,
  // 'display-16x9': Display16x9,
};
