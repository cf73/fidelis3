import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

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

async function testFrontendReviews() {
  try {
    console.log('🔍 Testing what the frontend would receive...');
    
    // Simulate the frontend query (same as getProductBySlug)
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', 'dac1-reference')
      .eq('published', true)
      .single();
    
    if (error) {
      console.error('❌ Error fetching product:', error);
      return;
    }
    
    console.log(`📋 Product: ${product.title}`);
    console.log(`   Reviews type: ${typeof product.reivews_set}`);
    
    if (typeof product.reivews_set === 'string') {
      console.log(`   Reviews string length: ${product.reivews_set.length}`);
      console.log(`   Reviews string preview: ${product.reivews_set.substring(0, 300)}...`);
      
      // Try to parse it as JSON (what the frontend would do)
      try {
        const parsedReviews = JSON.parse(product.reivews_set);
        console.log(`   ✅ Successfully parsed as JSON`);
        console.log(`   Parsed type: ${typeof parsedReviews}`);
        console.log(`   Is array: ${Array.isArray(parsedReviews)}`);
        
        if (Array.isArray(parsedReviews) && parsedReviews.length > 0) {
          const review = parsedReviews[0];
          console.log(`   First review:`, review);
          console.log(`   Excerpt: ${review.excerpt ? review.excerpt.substring(0, 100) + '...' : 'EMPTY'}`);
        }
      } catch (parseError) {
        console.error(`   ❌ Error parsing JSON:`, parseError.message);
      }
    } else if (Array.isArray(product.reivews_set)) {
      console.log(`   ✅ Reviews already an array`);
      console.log(`   Reviews count: ${product.reivews_set.length}`);
      if (product.reivews_set.length > 0) {
        const review = product.reivews_set[0];
        console.log(`   First review:`, review);
        console.log(`   Excerpt: ${review.excerpt ? review.excerpt.substring(0, 100) + '...' : 'EMPTY'}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testFrontendReviews();
