import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

console.log('🔍 Getting the correct anon key...\n');

const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (anonKey) {
  console.log('✅ Found VITE_SUPABASE_ANON_KEY:');
  console.log(anonKey);
} else {
  console.log('❌ VITE_SUPABASE_ANON_KEY not found');
} 