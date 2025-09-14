# PayPal Client ID Setup - Step by Step Guide

## 🎯 What You Need to Do

You need to get a **PayPal Client ID** from PayPal's Developer Dashboard and add it to your `.env` file.

## 📋 Step-by-Step Instructions

### Step 1: Access PayPal Developer Dashboard

1. Go to **https://developer.paypal.com/**
2. Click **"Log In"** in the top right
3. **Log in with the PayPal business account** that should receive payments:
   - Try `info@fidelisav.com` first
   - If that doesn't work, try `marc.mable@fidelisav.com`
   - Use the password for whichever account is the main business account

### Step 2: Create or Find Your App

**If you don't have an app yet:**
1. Click **"Create App"** button
2. Fill out the form:
   - **App Name**: "Fidelis Audio Website"
   - **Merchant**: Select your business account
   - **Features**: Check "Accept payments"
   - **Environment**: Start with "Sandbox" for testing

**If you already have an app:**
1. Look for existing apps in your dashboard
2. Click on the app name to view details

### Step 3: Get Your Client ID

1. In your app details page, you'll see:
   - **Client ID**: A long string like `AeHGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Client Secret**: Another long string (keep this private)

2. **Copy the Client ID** (the long string under "Client ID")

### Step 4: Update Your .env File

1. Open `react/.env` in your code editor
2. Find this line:
   ```env
   VITE_PAYPAL_CLIENT_ID=sandbox_client_id_here
   ```
3. Replace `sandbox_client_id_here` with your actual Client ID:
   ```env
   VITE_PAYPAL_CLIENT_ID=AeHGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Step 5: Set Environment Mode

For testing, keep it as sandbox:
```env
VITE_PAYPAL_ENVIRONMENT=sandbox
```

For live payments, change to:
```env
VITE_PAYPAL_ENVIRONMENT=production
```

## 🔧 Complete .env Example

Your `.env` file should look like this:

```env
VITE_SUPABASE_URL=https://myrdvcihcqphixvunvkv.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_ZYLpM53-USFtfMqfRPSCJg_rvukFgNx

# SEO Configuration
VITE_SITE_URL=https://fidelisaudio.com
VITE_BUSINESS_NAME=Fidelis Audio
VITE_BUSINESS_PHONE=+1-555-FIDELIS
VITE_BUSINESS_EMAIL=hello@fidelisaudio.com

# PayPal Configuration
VITE_PAYPAL_BUSINESS_EMAIL=info@fidelisav.com
VITE_PAYPAL_LOCAL_EMAIL=marc.mable@fidelisav.com
# PayPal SDK Configuration
VITE_PAYPAL_CLIENT_ID=AeHGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_PAYPAL_ENVIRONMENT=sandbox
```

## 🚀 After Setup

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test the PayPal button** on a pre-owned item page

3. **Check the browser console** for any PayPal configuration messages

## 🆘 Troubleshooting

### "I can't log into PayPal Developer Dashboard"
- Make sure you're using the business PayPal account, not a personal one
- Try password reset if needed
- Contact PayPal support if the account is locked

### "I don't see any apps in my dashboard"
- Click "Create App" to make a new one
- Make sure you're logged into the correct PayPal account

### "PayPal button still doesn't work"
- Check browser console for error messages
- Make sure you copied the full Client ID
- Verify the Client ID doesn't have extra spaces
- Try refreshing the page after updating .env

### "I want to go live immediately"
- Create a **production app** in PayPal Developer Dashboard
- Get the **production Client ID**
- Set `VITE_PAYPAL_ENVIRONMENT=production`
- Test thoroughly before going live

## 🎯 What Happens Next

Once you add the Client ID:
- ✅ PayPal buttons will work properly
- ✅ No more "Things don't appear to be working" errors
- ✅ Customers can complete purchases
- ✅ You'll receive payments in your PayPal account
- ✅ Fallback contact form still available as backup

## 📞 Need Help?

If you get stuck, the new integration includes automatic fallbacks, so customers can still purchase through the contact form while you get PayPal set up!
