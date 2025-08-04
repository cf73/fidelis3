import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from root .env file
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL || 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixC2700Image() {
  console.log('🔧 Fixing C2700 image...\n');

  try {
    // Update C2700 product with the correct image
    const { error: updateError } = await supabase
      .from('products')
      .update({ product_hero_image: 'c2700-front-top-phono.jpg' })
      .eq('title', 'C2700');

    if (updateError) {
      console.error('❌ Error updating C2700:', updateError);
    } else {
      console.log('✅ Successfully updated C2700 with image: c2700-front-top-phono.jpg');
    }

    // Verify the update
    const { data: c2700Product, error: fetchError } = await supabase
      .from('products')
      .select('title, product_hero_image')
      .eq('title', 'C2700')
      .single();

    if (fetchError) {
      console.error('❌ Error fetching updated C2700:', fetchError);
    } else {
      console.log('✅ Verification:');
      console.log(`  Title: ${c2700Product.title}`);
      console.log(`  Hero Image: ${c2700Product.product_hero_image || 'None'}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixC2700Image().catch(console.error); 