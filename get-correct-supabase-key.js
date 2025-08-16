import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;

// Try environment keys only
const possibleKeys = [
  process.env.SUPABASE_ANON_KEY,
  process.env.SUPABASE_SERVICE_ROLE_KEY
].filter(Boolean); // Remove undefined values

async function testKeys() {
  console.log('🔍 Testing Supabase keys...\n');

  for (let i = 0; i < possibleKeys.length; i++) {
    const key = possibleKeys[i];
    if (!key) {
      console.log(`Key ${i + 1}: Not found`);
      continue;
    }

    console.log(`Testing key ${i + 1}: ${key.substring(0, 50)}...`);

    try {
      const supabase = createClient(supabaseUrl, key);
      
      // Test with a simple query
      const { data, error } = await supabase
        .from('products')
        .select('id')
        .limit(1);

      if (error) {
        console.log(`❌ Key ${i + 1} failed:`, error.message);
      } else {
        console.log(`✅ Key ${i + 1} works! Found ${data?.length || 0} products`);
        console.log(`🔑 Correct key: ${key}`);
        return key;
      }
    } catch (err) {
      console.log(`❌ Key ${i + 1} failed:`, err.message);
    }
  }

  console.log('\n❌ No working keys found. Please check your .env file or Supabase dashboard.');
}

testKeys(); 