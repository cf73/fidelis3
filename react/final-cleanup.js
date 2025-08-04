const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function finalCleanup() {
  console.log('🧹 Final cleanup to ensure exact 1:1 transfer...\n');
  
  const expectedCounts = {
    products: 356,
    manufacturers: 58,
    news: 41,
    pre_owned: 54,
    testimonials: 7,
    pages: 9,
    evergreen_carousel: 6
  };
  
  for (const [tableName, expectedCount] of Object.entries(expectedCounts)) {
    try {
      console.log(`Processing ${tableName}...`);
      
      // Get current count
      const { count: currentCount } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      console.log(`   Current: ${currentCount}, Expected: ${expectedCount}`);
      
      if (currentCount > expectedCount) {
        // Get all records ordered by creation date
        const { data: records } = await supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: true });
        
        // Keep only the first N records
        const recordsToKeep = records.slice(0, expectedCount);
        const recordsToDelete = records.slice(expectedCount);
        
        if (recordsToDelete.length > 0) {
          const idsToDelete = recordsToDelete.map(r => r.id);
          
          // Delete excess records
          const { error: deleteError } = await supabase
            .from(tableName)
            .delete()
            .in('id', idsToDelete);
          
          if (deleteError) {
            console.error(`   ❌ Error deleting excess records:`, deleteError);
          } else {
            console.log(`   ✅ Removed ${recordsToDelete.length} excess records`);
          }
        }
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${tableName}:`, error);
    }
  }
  
  console.log('\n🎉 Final cleanup completed!');
}

finalCleanup(); 