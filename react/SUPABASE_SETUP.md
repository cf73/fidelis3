# Supabase Setup Guide for Fidelis AV

This guide will help you set up Supabase and import all the content from your Statamic site.

## 🚀 Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `fidelis-av`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

## 🔑 Step 2: Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

## ⚙️ Step 3: Update Environment Variables

1. Open `fidelis-react/.env`
2. Replace the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-actual-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

## 🗄️ Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-setup.sql`
3. Paste it into the SQL editor
4. Click "Run" to create all tables and indexes

## 📊 Step 5: Import Your Data

1. Make sure you're in the React app directory:
   ```bash
   cd fidelis-react
   ```

2. Run the import script:
   ```bash
   node import-data.js
   ```

This will import all your CSV data:
- **356 products** from your Statamic site
- **58 manufacturers**
- **41 news articles**
- **54 pre-owned items**
- **7 testimonials**
- **9 pages**
- **6 evergreen carousel items**

## 🔄 Step 6: Update React App

Once the data is imported, the React app will automatically use real data instead of mock data.

## 📋 Data Summary

Your Statamic site had:
- **356 products** with detailed specifications
- **58 manufacturers** with logos and descriptions
- **41 news articles** with dates and content
- **54 pre-owned items** with pricing
- **7 customer testimonials**
- **9 static pages** (About, Contact, etc.)
- **6 featured carousel items**

## 🎯 What's Next?

After setup, your React app will have:
- ✅ Real product data with images and specs
- ✅ Manufacturer information with logos
- ✅ News articles with proper dates
- ✅ Pre-owned equipment listings
- ✅ Customer testimonials
- ✅ All static pages content
- ✅ Search and filtering functionality
- ✅ Responsive design with animations

## 🐛 Troubleshooting

### If import fails:
1. Check your Supabase credentials in `.env`
2. Make sure the database schema was created successfully
3. Verify CSV files exist in the `exports/` directory
4. Check the console for specific error messages

### If data doesn't appear:
1. Check browser console for Supabase connection errors
2. Verify RLS policies are set to allow public read access
3. Test Supabase connection in the dashboard

## 📞 Support

If you encounter issues:
1. Check the Supabase dashboard for any error messages
2. Verify your API keys are correct
3. Test the connection using the Supabase client in the browser console

---

**Ready to go live!** 🚀 