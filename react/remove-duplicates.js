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

async function removeDuplicates() {
  console.log('🧹 Removing duplicate records...\n');
  
  const tables = [
    { name: 'manufacturers', key: 'title' },
    { name: 'products', key: 'title' },
    { name: 'news', key: 'title' },
    { name: 'pre_owned', key: 'title' },
    { name: 'testimonials', key: 'title' },
    { name: 'pages', key: 'title' },
    { name: 'evergreen_carousel', key: 'title' }
  ];
  
  for (const table of tables) {
    try {
      console.log(`Processing ${table.name}...`);
      
      // Get all records
      const { data: records, error } = await supabase
        .from(table.name)
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error(`❌ Error fetching ${table.name}:`, error);
        continue;
      }
      
      console.log(`   Found ${records.length} records`);
      
      // Group by title and keep only the first occurrence
      const seen = new Set();
      const duplicates = [];
      
      records.forEach(record => {
        const key = record[table.key];
        if (seen.has(key)) {
          duplicates.push(record.id);
        } else {
          seen.add(key);
        }
      });
      
      console.log(`   Found ${duplicates.length} duplicates`);
      
      // Delete duplicates
      if (duplicates.length > 0) {
        const { error: deleteError } = await supabase
          .from(table.name)
          .delete()
          .in('id', duplicates);
        
        if (deleteError) {
          console.error(`❌ Error deleting duplicates from ${table.name}:`, deleteError);
        } else {
          console.log(`   ✅ Removed ${duplicates.length} duplicates from ${table.name}`);
        }
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${table.name}:`, error);
    }
  }
  
  console.log('\n🎉 Duplicate removal completed!');
}

removeDuplicates(); 