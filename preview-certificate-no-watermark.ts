/**
 * Preview Script for Certificate A4 (No Watermark)
 * 
 * Generates a preview PDF of the certificate-a4-no-watermark template
 */

import { render, closeBrowser } from './src/renderer';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function generatePreview() {
  console.log('Generating certificate-a4-no-watermark preview...\n');

  // Sample data for the certificate
  const payload = {
    rank: 4,
    locationName: 'Greater Manchester',
    clinicName: 'Wakefield Veterinary Clinic',
    datePeriod: 'January - March 2026',
    websiteDomain: 'www.vetsinengland.com',
    tier: 'GOLD',
    signatureName: 'E. Holmes',
    signatureTitle: 'Signed E Holmes',
    country: 'England',
  };

  try {
    // Render the certificate as PDF
    const result = await render({
      templateKey: 'certificate-a4-no-watermark',
      templateVersion: 1,
      variant: 'A4',
      format: 'PDF',
      payload,
    });

    // Save to file
    const outputPath = join(__dirname, 'certificate-no-watermark-preview.pdf');
    writeFileSync(outputPath, result.buffer);

    console.log('✓ Certificate (no watermark) generated successfully!');
    console.log(`  File: ${outputPath}`);
    console.log(`  Size: ${result.buffer.length} bytes`);
    console.log(`  Hash: ${result.contentHash.slice(0, 16)}...`);
    console.log(`  MIME: ${result.mimeType}`);
    console.log('\nYou can now open the PDF file to view the preview.');

  } catch (error) {
    console.error('Error generating preview:', error);
    process.exit(1);
  } finally {
    await closeBrowser();
  }
}

generatePreview();
