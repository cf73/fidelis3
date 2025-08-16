// check-pre-owned-table.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkPreOwnedTable() {
  console.log('🔍 Checking pre_owned table in Supabase...\n');

  try {
    // Check if table exists by trying to query it
    const { data, error } = await supabase
      .from('pre_owned')
      .select('*')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        console.log('❌ Table "pre_owned" does not exist in Supabase');
        console.log('   This is why the migration keeps failing!');
        return;
      } else {
        console.error('❌ Error querying pre_owned table:', error);
        return;
      }
    }

    console.log('✅ Table "pre_owned" exists');
    console.log(`📊 Found ${data.length} records`);

    if (data.length > 0) {
      console.log('\n📋 Sample record structure:');
      console.log(JSON.stringify(data[0], null, 2));
    }

    // Get total count
    const { count, error: countError } = await supabase
      .from('pre_owned')
      .select('*', { count: 'exact', head: true });

    if (!countError) {
      console.log(`\n📈 Total records: ${count}`);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkPreOwnedTable();
