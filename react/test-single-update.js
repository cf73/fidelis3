import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key for admin operations


if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓' : '❌');
  console.error('\nPlease check your .env file and ensure both variables are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSingleUpdate() {
  console.log('🧪 Testing single update...\n');

  try {
    // First, let's see the current state
    const { data: beforeData, error: beforeError } = await supabase
      .from('product_categories')
      .select('*')
      .eq('slug', 'dacs')
      .single();

    if (beforeError) {
      console.error('Error fetching before:', beforeError);
      return;
    }

    console.log('📋 Before update:');
    console.log(JSON.stringify(beforeData, null, 2));
    console.log('');

    // Now try to update
    const testDescription = 'TEST UPDATE - Digital audio equipment has matured from new tech into being an essential element in modern high end music systems.';
    
    const { data: updateData, error: updateError } = await supabase
      .from('product_categories')
      .update({ category_description: testDescription })
      .eq('slug', 'dacs')
      .select();

    console.log('📝 Update result:');
    if (updateError) {
      console.error('❌ Update error:', updateError);
    } else {
      console.log('✅ Update response:', updateData);
    }
    console.log('');

    // Check the state after update
    const { data: afterData, error: afterError } = await supabase
      .from('product_categories')
      .select('*')
      .eq('slug', 'dacs')
      .single();

    if (afterError) {
      console.error('Error fetching after:', afterError);
      return;
    }

    console.log('📋 After update:');
    console.log(JSON.stringify(afterData, null, 2));
    console.log('');

    // Compare
    if (beforeData.category_description === afterData.category_description) {
      console.log('⚠️  No change detected - update may have failed silently');
    } else {
      console.log('✅ Change detected - update succeeded!');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testSingleUpdate().catch(console.error);

