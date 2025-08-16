import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTaxonomiesSimple() {
  console.log('🔍 Checking taxonomies in database...\n');

  try {
    // Check product categories
    const { data: categories, error: categoriesError } = await supabase
      .from('product_categories')
      .select('*')
      .order('name');

    if (categoriesError) {
      console.error('❌ Error fetching categories:', categoriesError);
    } else {
      console.log(`📋 Product Categories (${categories?.length || 0}):`);
      if (categories && categories.length > 0) {
        categories.forEach(cat => {
          console.log(`  - ${cat.name} (${cat.slug})`);
        });
      } else {
        console.log('  No categories found');
      }
    }

    console.log('');

    // Check manufacturers
    const { data: manufacturers, error: manufacturersError } = await supabase
      .from('manufacturers')
      .select('*')
      .order('name');

    if (manufacturersError) {
      console.error('❌ Error fetching manufacturers:', manufacturersError);
    } else {
      console.log(`🏭 Manufacturers (${manufacturers?.length || 0}):`);
      if (manufacturers && manufacturers.length > 0) {
        manufacturers.forEach(man => {
          console.log(`  - ${man.name} (${man.slug})`);
        });
      } else {
        console.log('  No manufacturers found');
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkTaxonomiesSimple(); 