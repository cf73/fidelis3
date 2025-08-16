import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const supabaseUrl = 'https://myrdvcihcqphixvunvkv.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3JwaGl4dnVudmt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDExMjY2OCwiZXhwIjoyMDY5Njg4NjY4fQ.389AOuFRVkhxesYoEEUmWWuL5Mkl0yU1OQMWG_BhgMM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migratePublishedStatus() {
  try {
    console.log('🚀 Starting published status migration...');
    
    const productsDir = path.resolve('../content/collections/products');
    const files = fs.readdirSync(productsDir).filter(file => file.endsWith('.md'));

    console.log(`📁 Found ${files.length} product files to process`);

    let processedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let notFoundCount = 0;
    let publishedCount = 0;
    let unpublishedCount = 0;

    for (const file of files) {
      try {
        const filePath = path.join(productsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data: frontMatter } = matter(fileContent);
        
        const filename = path.basename(file, '.md');
        processedCount++;

        // Check if the file has an ID (UUID)
        if (!frontMatter.id) {
          console.log(`   ⏭️  ${filename}: No UUID in file, skipping`);
          skippedCount++;
          continue;
        }

        // Determine published status from Statamic
        // Default is true (published) unless explicitly set to false
        const publishedInStatamic = frontMatter.published !== false;
        
        if (publishedInStatamic) {
          publishedCount++;
        } else {
          unpublishedCount++;
          console.log(`   📴 ${filename}: Unpublished in Statamic`);
        }

        // Get current data from Supabase using UUID
        const { data: currentProduct, error: fetchError } = await supabase
          .from('products')
          .select('slug, published')
          .eq('id', frontMatter.id)
          .single();

        if (fetchError) {
          console.log(`   ❌ ${filename}: Product UUID not found in Supabase`);
          notFoundCount++;
          continue;
        }

        // Check if update is needed
        if (currentProduct.published === publishedInStatamic) {
          // Status is already correct
          continue;
        }

        console.log(`   🔧 ${filename}: Updating published status`);
        console.log(`      Database slug: ${currentProduct.slug}`);
        console.log(`      Current status: ${currentProduct.published}`);
        console.log(`      Statamic status: ${publishedInStatamic}`);

        // Update Supabase using UUID
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            published: publishedInStatamic
          })
          .eq('id', frontMatter.id);

        if (updateError) {
          console.log(`   ❌ Error updating ${filename}:`, updateError.message);
          skippedCount++;
        } else {
          console.log(`   ✅ Successfully updated published status for ${filename}`);
          updatedCount++;
        }

      } catch (error) {
        console.log(`   ❌ Error processing ${file}:`, error.message);
        skippedCount++;
      }
    }

    console.log('\n🎉 Published status migration completed!');
    console.log(`📊 Summary:`);
    console.log(`   • Files processed: ${processedCount}`);
    console.log(`   • Published in Statamic: ${publishedCount}`);
    console.log(`   • Unpublished in Statamic: ${unpublishedCount}`);
    console.log(`   • Database updates made: ${updatedCount}`);
    console.log(`   • Files skipped: ${skippedCount}`);
    console.log(`   • UUIDs not found in DB: ${notFoundCount}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

migratePublishedStatus();
