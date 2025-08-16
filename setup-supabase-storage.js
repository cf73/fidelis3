// setup-supabase-storage.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const BUCKET = 'assets';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function setupStorage() {
  console.log('Setting up Supabase Storage...');
  
  try {
    // Create the bucket if it doesn't exist
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === BUCKET);
    
    if (!bucketExists) {
      console.log(`Creating bucket: ${BUCKET}`);
      const { error: createError } = await supabase.storage.createBucket(BUCKET, {
        public: true,
        allowedMimeTypes: ['image/*', 'application/pdf', 'text/*'],
        fileSizeLimit: 52428800 // 50MB
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return;
      }
      console.log(`✅ Bucket '${BUCKET}' created successfully`);
    } else {
      console.log(`✅ Bucket '${BUCKET}' already exists`);
    }
    
    // Set up RLS policies for the bucket
    console.log('Setting up RLS policies...');
    
    // Policy for public read access
    const { error: readPolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Public read access" ON storage.objects
        FOR SELECT USING (bucket_id = '${BUCKET}');
      `
    });
    
    if (readPolicyError) {
      console.log('Read policy setup error (may already exist):', readPolicyError.message);
    } else {
      console.log('✅ Read policy created');
    }
    
    // Policy for authenticated insert/update
    const { error: insertPolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Authenticated insert/update" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = '${BUCKET}' AND auth.role() = 'authenticated');
        
        CREATE POLICY IF NOT EXISTS "Authenticated update" ON storage.objects
        FOR UPDATE USING (bucket_id = '${BUCKET}' AND auth.role() = 'authenticated');
      `
    });
    
    if (insertPolicyError) {
      console.log('Insert/update policy setup error (may already exist):', insertPolicyError.message);
    } else {
      console.log('✅ Insert/update policies created');
    }
    
    console.log('✅ Storage setup complete!');
    
  } catch (error) {
    console.error('Setup error:', error);
  }
}

setupStorage(); 