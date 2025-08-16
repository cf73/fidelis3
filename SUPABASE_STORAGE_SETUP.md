# Supabase Storage Setup Guide

## Step 1: Create the Assets Bucket

1. Go to your **Supabase Dashboard**
2. Navigate to **Storage**
3. Click **"Create a new bucket"**
4. Set the following:
   - **Name**: `assets`
   - **Public bucket**: ✅ (uncheck "Private bucket")
   - **File size limit**: 50MB (or your preferred limit)
5. Click **"Create bucket"**

## Step 2: Get Your Service Role Key

1. In your **Supabase Dashboard**, go to **Settings > API**
2. Copy the **service_role key** (not the anon key)
3. Add it to your `.env` file in the React app:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 3: Run the Production Storage Setup

Run the `setup-production-storage.sql` script in your Supabase SQL editor.

## Step 4: Test Image Upload

Once you've added the service role key to your `.env` file, run:

```bash
node upload-images-with-service-role.js
```

## Step 5: Update React App

After successful upload, update the `getImageUrl` function in `react/src/lib/supabase.ts` to use Supabase Storage URLs.

## Production Security Notes

- The service role key bypasses RLS and should only be used for admin operations
- Public read access is allowed for the assets bucket
- Upload/update/delete requires authentication
- This setup is production-ready and secure

## Troubleshooting

If you get permission errors:
1. Make sure the assets bucket exists and is public
2. Verify the service role key is correct
3. Check that the SQL policies were created successfully
4. Ensure RLS is enabled on storage.objects 