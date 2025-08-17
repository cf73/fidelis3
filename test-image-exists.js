import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

async function testImageExists() {
  console.log('🔍 Testing if C2700 image exists...\n');

  try {
    // Method 1: Direct file check
    const directPath = 'assets/c2700-front-top-phono.jpg';
    const exists = fs.existsSync(directPath);
    console.log(`Direct file check: ${exists ? '✅ Exists' : '❌ Not found'}`);

    // Method 2: Glob pattern
    const assetFiles = await glob('assets/**/*.{jpg,jpeg,png,gif,webp,svg}', {
      nodir: true
    });
    const assetFilenames = new Set(assetFiles.map(file => path.basename(file)));
    
    console.log(`Glob found ${assetFiles.length} files`);
    console.log(`C2700 image in glob results: ${assetFilenames.has('c2700-front-top-phono.jpg') ? '✅ Yes' : '❌ No'}`);

    // Method 3: List all files and search
    const allFiles = fs.readdirSync('assets');
    console.log(`Assets directory has ${allFiles.length} files`);
    console.log(`C2700 image in directory listing: ${allFiles.includes('c2700-front-top-phono.jpg') ? '✅ Yes' : '❌ No'}`);

    // Method 4: Check specific file
    const specificFile = path.join('assets', 'c2700-front-top-phono.jpg');
    const specificExists = fs.existsSync(specificFile);
    console.log(`Specific file check: ${specificExists ? '✅ Exists' : '❌ Not found'}`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testImageExists().catch(console.error); 