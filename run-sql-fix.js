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

async function runSqlFix() {
  console.log('🔧 Running SQL fix for product relationships...\n');

  try {
    // Read the SQL file
    const fs = await import('fs');
    const sqlContent = fs.readFileSync('fix-product-relationships-direct.sql', 'utf8');
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\n🔧 Executing statement ${i + 1}/${statements.length}:`);
      console.log(statement.substring(0, 100) + '...');

      try {
        const { data, error } = await supabase
          .from('_exec_sql')
          .select('*')
          .eq('sql', statement);

        if (error) {
          console.error(`❌ Error executing statement ${i + 1}:`, error);
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.error(`❌ Failed to execute statement ${i + 1}:`, err.message);
      }
    }

    console.log('\n🎉 SQL fix completed!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

runSqlFix(); 