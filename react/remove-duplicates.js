const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

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