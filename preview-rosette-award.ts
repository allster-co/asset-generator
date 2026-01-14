/**
 * Preview Script for Rosette Award
 * 
 * Generates a preview PNG of the rosette-award template (800x800)
 */

import { render, closeBrowser } from './src/renderer';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function generatePreview() {
  console.log('Generating rosette-award preview (800x800)...\n');

  // Sample data for the rosette award
  const payload = {
    rank: 4,
    locationName: 'Wakefield',
    datePeriod: 'June 2026',
    categoryLabel: 'VetsinEngland',
    tier: 'GOLD',
  };

  try {
    // Render the rosette award as PNG
    const result = await render({
      templateKey: 'rosette-award',
      templateVersion: 1,
      variant: '800x800',
      format: 'PNG',
      payload,
    });

    // Save to file
    const outputPath = join(__dirname, 'rosette-award-preview.png');
    writeFileSync(outputPath, result.buffer);

    console.log('✓ Rosette award generated successfully!');
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
