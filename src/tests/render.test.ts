/**
 * Integration Tests for Renderer
 * 
 * Tests core rendering functionality:
 * - PNG rendering (social-square 1080x1080)
 * - PDF rendering (certificate-a4 A4)
 * - Determinism (same input = same hash)
 * 
 * Run with: npm test
 */

import { render, closeBrowser } from '../renderer';

const TEST_PAYLOAD = {
  rank: 1,
  locationName: 'Test City',
  clinicName: 'Test Veterinary Clinic',
  datePeriod: '2026',
  websiteDomain: 'www.example.com',
  tier: 'GOLD',
};

async function testPngRendering(): Promise<void> {
  console.log('\n[TEST] PNG Rendering (social-square 1080x1080)...');
  
  const result = await render({
    templateKey: 'social-square',
    templateVersion: 1,
    variant: '1080x1080',
    format: 'PNG',
    payload: TEST_PAYLOAD,
  });

  // Assertions
  if (result.buffer.length === 0) {
    throw new Error('PNG buffer is empty');
  }
  if (!result.contentHash || result.contentHash.length !== 64) {
    throw new Error(`Invalid content hash: ${result.contentHash}`);
  }
  if (result.mimeType !== 'image/png') {
    throw new Error(`Wrong mime type: ${result.mimeType}`);
  }
  if (result.width !== 1080 || result.height !== 1080) {
    throw new Error(`Wrong dimensions: ${result.width}x${result.height}`);
  }

  console.log(`  ✓ Buffer: ${result.buffer.length} bytes`);
  console.log(`  ✓ Hash: ${result.contentHash.slice(0, 16)}...`);
  console.log(`  ✓ Dimensions: ${result.width}x${result.height}`);
  
  return;
}

async function testPdfRendering(): Promise<void> {
  console.log('\n[TEST] PDF Rendering (certificate-a4 A4)...');
  
  const result = await render({
    templateKey: 'certificate-a4',
    templateVersion: 1,
    variant: 'A4',
    format: 'PDF',
    payload: TEST_PAYLOAD,
  });

  // Assertions
  if (result.buffer.length === 0) {
    throw new Error('PDF buffer is empty');
  }
  if (!result.contentHash || result.contentHash.length !== 64) {
    throw new Error(`Invalid content hash: ${result.contentHash}`);
  }
  if (result.mimeType !== 'application/pdf') {
    throw new Error(`Wrong mime type: ${result.mimeType}`);
  }

  // Check PDF magic bytes
  const pdfHeader = result.buffer.slice(0, 5).toString();
  if (pdfHeader !== '%PDF-') {
    throw new Error(`Invalid PDF header: ${pdfHeader}`);
  }

  console.log(`  ✓ Buffer: ${result.buffer.length} bytes`);
  console.log(`  ✓ Hash: ${result.contentHash.slice(0, 16)}...`);
  console.log(`  ✓ Valid PDF header`);
}

async function testDeterminism(): Promise<void> {
  console.log('\n[TEST] Determinism (same input = same hash)...');
  
  const result1 = await render({
    templateKey: 'social-square',
    templateVersion: 1,
    variant: '1080x1080',
    format: 'PNG',
    payload: TEST_PAYLOAD,
  });

  const result2 = await render({
    templateKey: 'social-square',
    templateVersion: 1,
    variant: '1080x1080',
    format: 'PNG',
    payload: TEST_PAYLOAD,
  });

  if (result1.contentHash !== result2.contentHash) {
    throw new Error(`Hashes differ!\n  First:  ${result1.contentHash}\n  Second: ${result2.contentHash}`);
  }

  console.log(`  ✓ Hash 1: ${result1.contentHash.slice(0, 16)}...`);
  console.log(`  ✓ Hash 2: ${result2.contentHash.slice(0, 16)}...`);
  console.log(`  ✓ Hashes match!`);
}

async function testStoryRendering(): Promise<void> {
  console.log('\n[TEST] Story Rendering (social-story 1080x1920)...');
  
  const result = await render({
    templateKey: 'social-story',
    templateVersion: 1,
    variant: '1080x1920',
    format: 'PNG',
    payload: TEST_PAYLOAD,
  });

  if (result.buffer.length === 0) {
    throw new Error('PNG buffer is empty');
  }
  if (result.width !== 1080 || result.height !== 1920) {
    throw new Error(`Wrong dimensions: ${result.width}x${result.height}`);
  }

  console.log(`  ✓ Buffer: ${result.buffer.length} bytes`);
  console.log(`  ✓ Dimensions: ${result.width}x${result.height}`);
}

async function testDisplayRendering(): Promise<void> {
  console.log('\n[TEST] Display Rendering (display-16x9 1920x1080)...');
  
  const result = await render({
    templateKey: 'display-16x9',
    templateVersion: 1,
    variant: '1920x1080',
    format: 'PNG',
    payload: TEST_PAYLOAD,
  });

  if (result.buffer.length === 0) {
    throw new Error('PNG buffer is empty');
  }
  if (result.width !== 1920 || result.height !== 1080) {
    throw new Error(`Wrong dimensions: ${result.width}x${result.height}`);
  }

  console.log(`  ✓ Buffer: ${result.buffer.length} bytes`);
  console.log(`  ✓ Dimensions: ${result.width}x${result.height}`);
}

async function runTests(): Promise<void> {
  console.log('='.repeat(50));
  console.log('Asset Renderer Integration Tests');
  console.log('='.repeat(50));

  let passed = 0;
  let failed = 0;

  const tests = [
    { name: 'PNG Rendering', fn: testPngRendering },
    { name: 'PDF Rendering', fn: testPdfRendering },
    { name: 'Story Rendering', fn: testStoryRendering },
    { name: 'Display Rendering', fn: testDisplayRendering },
    { name: 'Determinism', fn: testDeterminism },
  ];

  for (const test of tests) {
    try {
      await test.fn();
      passed++;
    } catch (error) {
      failed++;
      console.error(`\n  ✗ ${test.name} FAILED:`, error);
    }
  }

  // Cleanup
  await closeBrowser();

  console.log('\n' + '='.repeat(50));
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(50));

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
