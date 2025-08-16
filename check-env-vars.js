import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

console.log('🔍 Checking environment variables...\n');

const envVars = process.env;
const supabaseVars = {};

for (const [key, value] of Object.entries(envVars)) {
  if (key.includes('SUPABASE') || key.includes('supabase')) {
    supabaseVars[key] = value ? `${value.substring(0, 20)}...` : 'undefined';
  }
}

console.log('📋 Supabase-related environment variables:');
Object.entries(supabaseVars).forEach(([key, value]) => {
  console.log(`  ${key}: ${value}`);
});

if (Object.keys(supabaseVars).length === 0) {
  console.log('❌ No Supabase environment variables found');
} 