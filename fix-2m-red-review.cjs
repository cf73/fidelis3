#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs');
const matter = require('gray-matter');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const fixReview = async () => {
  console.log('🔄 Fixing 2M Red review...');

  // Read the markdown file
  const filePath = 'content/collections/products/2m-red.md';
  const content = fs.readFileSync(filePath, 'utf8');
  const { data: frontMatter } = matter(content);
  
  console.log('📝 Parsed reviews_set from markdown:');
  console.log(JSON.stringify(frontMatter.reviews_set, null, 2));
  
  if (frontMatter.reviews_set && Array.isArray(frontMatter.reviews_set)) {
    try {
      // Update the database with the correct review data
      const { error } = await supabase
        .from('products')
        .update({ 
          reivews_set: JSON.stringify(frontMatter.reviews_set)
        })
        .eq('slug', '2m-red');
      
      if (error) {
        console.error('❌ Error updating database:', error);
      } else {
        console.log('✅ Successfully updated 2M Red reviews in database');
        
        // Verify the update
        const { data: updated } = await supabase
          .from('products')
          .select('reivews_set')
          .eq('slug', '2m-red')
          .single();
          
        console.log('🔍 Updated database content:');
        console.log(updated.reivews_set);
      }
    } catch (err) {
      console.error('❌ Error:', err);
    }
  } else {
    console.log('❌ No valid reviews_set found in markdown');
  }
};

fixReview();

