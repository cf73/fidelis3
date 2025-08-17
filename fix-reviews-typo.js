#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔍 Fixing reviews_set typo across all product files...');

// Find all product markdown files
const productFiles = glob.sync('content/collections/products/*.md');

let fixedCount = 0;
let totalCount = 0;

productFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file contains the typo
  if (content.includes('reivews_set:')) {
    totalCount++;
    console.log(`📝 Fixing: ${path.basename(filePath)}`);
    
    // Fix the typo
    const fixedContent = content.replace(/reivews_set:/g, 'reviews_set:');
    
    // Write back to file
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    fixedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount}/${totalCount} files with reviews_set typo`);

if (fixedCount > 0) {
  console.log('\n🚀 Now run the migration script to update the database with corrected review data');
}

