/**
 * Preview Script for Social Square
 * 
 * Generates a preview PNG of the social-square template (1080x1080)
 */

import { render, closeBrowser } from './src/renderer';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function generatePreview() {
  console.log('Generating social-square preview (1080x1080)...\n');

  // Sample data for the social square
  const payload = {
    rank: 2,
    locationName: 'Wakefield',
    clinicName: 'Abbey House Veterinary Hospital',
    datePeriod: 'January - March 2026',
    websiteDomain: 'www.vetsinengland.com',
    tier: 'GOLD',
  };

  try {
    // Render the social square as PNG
    const result = await render({
      templateKey: 'social-square',
      templateVersion: 1,
      variant: '1080x1080',
      format: 'PNG',
      payload,
    });

    // Save to file
    const outputPath = join(__dirname, 'social-square-preview.png');
    writeFileSync(outputPath, result.buffer);

    console.log('✓ Social square generated successfully!');
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
