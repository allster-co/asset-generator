/**
 * Preview Script for Display 16:9 (No Watermark)
 * 
 * Generates a preview PNG of the display-16x9-no-watermark template (1920x1080)
 */

import { render, closeBrowser } from './src/renderer';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function generatePreview() {
  console.log('Generating display-16x9-no-watermark preview (1920x1080)...\n');

  // Sample data for the display
  const payload = {
    rank: 1,
    locationName: 'Greater Manchester',
    clinicName: 'Wakefield Veterinary Clinic',
    datePeriod: 'January - March 2026',
    websiteDomain: 'www.vetsinengland.com',
    tier: 'GOLD',
  };

  try {
    // Render the display as PNG
    const result = await render({
      templateKey: 'display-16x9-no-watermark',
      templateVersion: 1,
      variant: '1920x1080',
      format: 'PNG',
      payload,
    });

    // Save to file
    const outputPath = join(__dirname, 'display-16x9-no-watermark-preview.png');
    writeFileSync(outputPath, result.buffer);

    console.log('✓ Display 16:9 (no watermark) generated successfully!');
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
