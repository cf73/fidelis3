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

// Function to convert slug to proper name
function slugToName(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

async function fixManufacturerNames() {
  console.log('🔧 Fixing manufacturer names...\n');

  try {
    // Get all manufacturers with null names
    const { data: manufacturers, error: manufacturersError } = await supabase
      .from('manufacturers')
      .select('id, name, slug')
      .is('name', null)
      .order('slug');

    if (manufacturersError) {
      console.error('❌ Error fetching manufacturers:', manufacturersError);
      return;
    }

    console.log(`📋 Found ${manufacturers?.length || 0} manufacturers with null names`);

    let updatedCount = 0;

    for (const manufacturer of manufacturers || []) {
      const properName = slugToName(manufacturer.slug);
      
      const { error: updateError } = await supabase
        .from('manufacturers')
        .update({ name: properName })
        .eq('id', manufacturer.id);

      if (updateError) {
        console.error(`❌ Error updating manufacturer ${manufacturer.slug}:`, updateError);
      } else {
        console.log(`✅ Updated "${manufacturer.slug}" -> "${properName}"`);
        updatedCount++;
      }
    }

    console.log(`\n🎉 Updated ${updatedCount} manufacturer names`);

    // Verify the fix
    console.log('\n🧪 Verifying fix...');
    const { data: verifyManufacturers, error: verifyError } = await supabase
      .from('manufacturers')
      .select('name, slug')
      .order('name')
      .limit(10);

    if (verifyError) {
      console.error('❌ Error verifying manufacturers:', verifyError);
    } else {
      console.log('✅ Sample manufacturers with names:');
      verifyManufacturers?.forEach(man => {
        console.log(`  - ${man.name} (${man.slug})`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixManufacturerNames(); 