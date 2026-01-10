/**
 * Copy assets to project root for production.
 * 
 * This ensures assets are available at runtime regardless
 * of whether we're running from src/ or dist/.
 */

const fs = require('fs-extra');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src', 'assets');
const destDir = path.join(__dirname, '..', 'assets');

console.log(`Copying assets from ${srcDir} to ${destDir}`);

if (fs.existsSync(srcDir)) {
  fs.copySync(srcDir, destDir);
  console.log('Assets copied successfully');
} else {
  console.log('Source assets directory not found, creating empty assets directory');
  fs.ensureDirSync(destDir);
  fs.ensureDirSync(path.join(destDir, 'fonts'));
}
