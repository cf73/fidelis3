const { createClient } = require('@supabase/supabase-js');

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

async function clearAllData() {
  console.log('🗑️  Clearing all data from Supabase...\n');
  
  const tables = [
    'products',
    'manufacturers', 
    'news',
    'pre_owned',
    'testimonials',
    'pages',
    'evergreen_carousel'
  ];
  
  for (const table of tables) {
    try {
      console.log(`Clearing ${table}...`);
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
      
      if (error) {
        console.error(`❌ Error clearing ${table}:`, error);
      } else {
        console.log(`✅ Cleared ${table}`);
      }
    } catch (error) {
      console.error(`❌ Error clearing ${table}:`, error);
    }
  }
  
  console.log('\n🎉 Data clearing completed!');
}

clearAllData(); 