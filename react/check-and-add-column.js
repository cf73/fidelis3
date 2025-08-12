import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndAddColumn() {
  console.log('🔍 Checking if category_description column exists...\n');

  try {
    // First, let's try to add the column if it doesn't exist
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS category_description TEXT;'
    });

    if (alterError) {
      console.log('Note: Could not add column via RPC (this is normal for anon key)');
      console.log('You may need to run the SQL manually in Supabase Studio');
    } else {
      console.log('✅ Column added successfully');
    }

    // Now let's test updating a single record
    const { data, error } = await supabase
      .from('product_categories')
      .update({ 
        category_description: 'TEST DESCRIPTION - Digital audio equipment has matured from new tech into being an essential element in modern high end music systems.' 
      })
      .eq('slug', 'dacs')
      .select();

    if (error) {
      console.error('❌ Error updating record:', error);
      console.log('\n💡 This suggests the column may not exist or there are permission issues.');
      console.log('Please run this SQL in Supabase Studio:');
      console.log('ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS category_description TEXT;');
    } else {
      console.log('✅ Successfully updated DACs category with test description');
      console.log('Updated record:', data[0]);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkAndAddColumn().catch(console.error);
