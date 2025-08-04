const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

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