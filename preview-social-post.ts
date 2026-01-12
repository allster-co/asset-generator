/**
 * Preview Script for Social Post
 * 
 * Generates a preview PNG of the social-post template (1080x1350)
 */

import { render, closeBrowser } from './src/renderer';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function generatePreview() {
  console.log('Generating social-post preview (1080x1350)...\n');

  // Sample data for the social post
  const payload = {
    rank: 1,
    locationName: 'Greater Manchester',
    clinicName: 'Wakefield Veterinary Clinic Wakefield Veterinary Clinic',
    datePeriod: 'January - March 2026',
    websiteDomain: 'www.vetsinengland.com',
    tier: 'GOLD',
  };

  try {
    // Render the social post as PNG
    const result = await render({
      templateKey: 'social-post',
      templateVersion: 1,
      variant: '1080x1350',
      format: 'PNG',
      payload,
    });

    // Save to file
    const outputPath = join(__dirname, 'social-post-preview.png');
    writeFileSync(outputPath, result.buffer);

    console.log('✓ Social post generated successfully!');
    console.log(`  File: ${outputPath}`);
    console.log(`  Size: ${result.buffer.length} bytes`);
    console.log(`  Hash: ${result.contentHash.slice(0, 16)}...`);
    console.log(`  MIME: ${result.mimeType}`);
    console.log(`  Dimensions: ${result.width}x${result.height}`);
    console.log('\nYou can now open the PNG file to view the preview.');

  } catch (error) {
    console.error('Error generating preview:', error);
    process.exit(1);
  } finally {
    await closeBrowser();
  }
}

generatePreview();
