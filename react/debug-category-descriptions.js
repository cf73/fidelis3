import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugCategoryDescriptions() {
  console.log('🔍 Debugging category descriptions...\n');

  try {
    // Get all product categories
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }

    console.log(`📊 Found ${data.length} categories in database\n`);

    // Check each category for the category_description field
    data.forEach(category => {
      console.log(`📋 ${category.name} (${category.slug}):`);
      console.log(`   ID: ${category.id}`);
      console.log(`   Has category_description: ${!!category.category_description}`);
      if (category.category_description) {
        console.log(`   Description: "${category.category_description.substring(0, 80)}..."`);
      } else {
        console.log(`   Description: NULL/undefined`);
      }
      console.log('');
    });

    // Specifically check the DACs category
    const dacsCategory = data.find(cat => cat.slug === 'dacs');
    if (dacsCategory) {
      console.log('🎯 DACs category details:');
      console.log(JSON.stringify(dacsCategory, null, 2));
    } else {
      console.log('❌ DACs category not found');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

debugCategoryDescriptions().catch(console.error);

