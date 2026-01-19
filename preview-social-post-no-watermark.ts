/**
 * Preview Script for Social Post (No Watermark)
 * 
 * Generates a preview PNG of the social-post-no-watermark template (1080x1350)
 */

import { render, closeBrowser } from './src/renderer';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function generatePreview() {
  console.log('Generating social-post-no-watermark preview (1080x1350)...\n');

  // Sample data for the social post
  const payload = {
    rank: 4,
    locationName: 'Greater Manchester',
    clinicName: 'Wakefield Veterinary Clinic',
    datePeriod: 'January - March 2026',
    websiteDomain: 'www.vetsinengland.com',
    tier: 'GOLD',
  };

  try {
    // Render the social post as PNG
    const result = await render({
      templateKey: 'social-post-no-watermark',
      templateVersion: 1,
      variant: '1080x1350',
      format: 'PNG',
      payload,
    });

    // Save to file
    const outputPath = join(__dirname, 'social-post-no-watermark-preview.png');
    writeFileSync(outputPath, result.buffer);

    console.log('✓ Social post (no watermark) generated successfully!');
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
