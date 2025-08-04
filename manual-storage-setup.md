# Manual Supabase Storage Setup (No SQL Required)

Since we're getting permission errors with SQL, let's set up storage manually through the Supabase Dashboard.

## Step 1: Create the Assets Bucket

1. Go to your **Supabase Dashboard**
2. Navigate to **Storage**
3. Click **"Create a new bucket"**
4. Set the following:
   - **Name**: `assets`
   - **Public bucket**: ✅ (uncheck "Private bucket")
   - **File size limit**: 50MB
5. Click **"Create bucket"**

## Step 2: Get Your Service Role Key

1. In your **Supabase Dashboard**, go to **Settings > API**
2. Copy the **service_role key** (not the anon key)
3. Add it to your `.env` file in the React app:

```env
VITE_SUPABASE_URL=https://myrdvcihcqphixvunvkv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cmR2Y2loY3FwaGl4dnVudmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTI2NjgsImV4cCI6MjA2OTY4ODY2OH0.JdgMDoqEA4UYRHHCThbPao40AQwTrUWATjZAXw_0J1g
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 3: Test Image Upload

Once you've added the service role key to your `.env` file, run:

```bash
node upload-images-with-service-role.js
```

## Step 4: Update React App

After successful upload, update the `getImageUrl` function in `react/src/lib/supabase.ts` to use Supabase Storage URLs.

## Why This Works

- The **service role key** bypasses all RLS policies
- The **public bucket** allows public read access
- No SQL permissions required
- Production-ready and secure

## Troubleshooting

If you still get errors:
1. Make sure the assets bucket exists and is public
2. Verify the service role key is correct (not the anon key)
3. Check that the bucket name is exactly "assets" 