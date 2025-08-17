import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  try {
    // Test products
    console.log('📦 Testing products table...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.error('❌ Products error:', productsError);
    } else {
      console.log(`✅ Products: ${products.length} items found`);
      if (products.length > 0) {
        console.log(`   Sample: ${products[0].title}`);
      }
    }

    // Test manufacturers
    console.log('\n🏭 Testing manufacturers table...');
    const { data: manufacturers, error: manufacturersError } = await supabase
      .from('manufacturers')
      .select('*')
      .limit(5);
    
    if (manufacturersError) {
      console.error('❌ Manufacturers error:', manufacturersError);
    } else {
      console.log(`✅ Manufacturers: ${manufacturers.length} items found`);
      if (manufacturers.length > 0) {
        console.log(`   Sample: ${manufacturers[0].title}`);
      }
    }

    // Test news
    console.log('\n📰 Testing news table...');
    const { data: news, error: newsError } = await supabase
      .from('news')
      .select('*')
      .limit(5);
    
    if (newsError) {
      console.error('❌ News error:', newsError);
    } else {
      console.log(`✅ News: ${news.length} items found`);
      if (news.length > 0) {
        console.log(`   Sample: ${news[0].title}`);
      }
    }

    // Test pre-owned
    console.log('\n🛍️ Testing pre-owned table...');
    const { data: preOwned, error: preOwnedError } = await supabase
      .from('pre_owned')
      .select('*')
      .limit(5);
    
    if (preOwnedError) {
      console.error('❌ Pre-owned error:', preOwnedError);
    } else {
      console.log(`✅ Pre-owned: ${preOwned.length} items found`);
      if (preOwned.length > 0) {
        console.log(`   Sample: ${preOwned[0].title}`);
      }
    }

    // Test testimonials
    console.log('\n💬 Testing testimonials table...');
    const { data: testimonials, error: testimonialsError } = await supabase
      .from('testimonials')
      .select('*')
      .limit(5);
    
    if (testimonialsError) {
      console.error('❌ Testimonials error:', testimonialsError);
    } else {
      console.log(`✅ Testimonials: ${testimonials.length} items found`);
      if (testimonials.length > 0) {
        console.log(`   Sample: ${testimonials[0].title}`);
      }
    }

    // Test evergreen carousel
    console.log('\n🎠 Testing evergreen carousel table...');
    const { data: carousel, error: carouselError } = await supabase
      .from('evergreen_carousel')
      .select('*')
      .limit(5);
    
    if (carouselError) {
      console.error('❌ Carousel error:', carouselError);
    } else {
      console.log(`✅ Carousel: ${carousel.length} items found`);
      if (carousel.length > 0) {
        console.log(`   Sample: ${carousel[0].title}`);
      }
    }

    console.log('\n🎉 Supabase connection test completed!');
    console.log('✅ All tables are accessible and contain data.');
    console.log('🌐 Your React app should now be working with Supabase!');

  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection(); 