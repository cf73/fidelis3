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

async function fixRelationships() {
  console.log('🔧 Fixing product relationships...\n');

  try {
    // Add manufacturer_id column to products table
    const { error: manufacturerError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'products' AND column_name = 'manufacturer_id'
            ) THEN
                ALTER TABLE products ADD COLUMN manufacturer_id UUID REFERENCES manufacturers(id);
            END IF;
        END $$;
      `
    });

    if (manufacturerError) {
      console.error('❌ Error adding manufacturer_id:', manufacturerError);
    } else {
      console.log('✅ Added manufacturer_id column');
    }

    // Add category_id column to products table
    const { error: categoryError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'products' AND column_name = 'category_id'
            ) THEN
                ALTER TABLE products ADD COLUMN category_id UUID REFERENCES product_categories(id);
            END IF;
        END $$;
      `
    });

    if (categoryError) {
      console.error('❌ Error adding category_id:', categoryError);
    } else {
      console.log('✅ Added category_id column');
    }

    // Refresh schema cache
    const { error: refreshError } = await supabase.rpc('exec_sql', {
      sql: 'NOTIFY pgrst, \'reload schema\';'
    });

    if (refreshError) {
      console.error('❌ Error refreshing schema:', refreshError);
    } else {
      console.log('✅ Refreshed schema cache');
    }

    console.log('\n🎉 Relationships should now be fixed!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixRelationships(); 