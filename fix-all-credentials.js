import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pattern to match hardcoded Supabase credentials
const urlPattern = /const supabaseUrl = 'https:\/\/[^']+';/g;
const keyPattern = /const supabaseKey = 'eyJ[^']+';.*$/gm;
const serviceKeyPattern = /const serviceRoleKey = 'eyJ[^']+';.*$/gm;

// Replacement patterns
const secureUrlReplacement = `const supabaseUrl = process.env.VITE_SUPABASE_URL;`;
const secureKeyReplacement = `const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key for admin operations`;
const secureServiceKeyReplacement = `const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key for admin operations`;

// Environment check code to add
const envCheckCode = `
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓' : '❌');
  console.error('\\nPlease check your .env file and ensure both variables are set.');
  process.exit(1);
}`;

function fixCredentialsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    // Check if file contains hardcoded credentials
    const hasCredentials = /const\s+(?:supabaseKey|serviceRoleKey)\s*=\s*['"]eyJ[^'"]+['"]/.test(content);
    if (!hasCredentials) {
      return false; // No credentials to fix
    }

    console.log(`🔧 Fixing credentials in: ${filePath}`);

    // Add dotenv import if not present
    if (!content.includes('import { config } from \'dotenv\'')) {
      content = content.replace(
        /(import.*from.*['"];)\n/,
        '$1\nimport { config } from \'dotenv\';\n'
      );
      modified = true;
    }

    // Add dotenv config if not present
    if (!content.includes('config();')) {
      content = content.replace(
        /(import.*from.*['"];)\n\n/,
        '$1\n\n// Load environment variables\nconfig();\n\n'
      );
      modified = true;
    }

    // Replace hardcoded URL
    if (urlPattern.test(content)) {
      content = content.replace(urlPattern, secureUrlReplacement);
      modified = true;
    }

    // Replace hardcoded service key (both variants)
    if (keyPattern.test(content)) {
      content = content.replace(keyPattern, secureKeyReplacement);
      modified = true;
    }
    if (serviceKeyPattern.test(content)) {
      content = content.replace(serviceKeyPattern, secureServiceKeyReplacement);
      modified = true;
    }

    // Add environment variable check if not present
    if (!content.includes('Missing required environment variables') && modified) {
      const supabaseClientMatch = content.match(/const supabase = createClient\(supabaseUrl, (?:supabaseKey|serviceRoleKey)\);/);
      if (supabaseClientMatch) {
        content = content.replace(
          supabaseClientMatch[0],
          envCheckCode + '\n\n' + supabaseClientMatch[0]
        );
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Find all JS files with credentials
const jsFiles = [];
function findJsFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !['node_modules', 'dist', '.git'].includes(file)) {
      findJsFiles(fullPath);
    } else if (file.endsWith('.js') && !file.includes('fix-all-credentials')) {
      jsFiles.push(fullPath);
    }
  }
}

findJsFiles(__dirname);

console.log('🔍 Scanning for hardcoded credentials...');
let fixedCount = 0;

for (const file of jsFiles) {
  if (fixCredentialsInFile(file)) {
    fixedCount++;
  }
}

console.log(`\n🎉 Credential fix complete!`);
console.log(`📊 Fixed ${fixedCount} files`);
console.log(`🔒 All scripts now use environment variables for security`);
