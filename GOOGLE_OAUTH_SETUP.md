# Google OAuth Setup Guide

This guide will help you set up Google as a federated sign-in provider for your Supabase authentication.

## Prerequisites

- A Supabase project
- A Google Cloud Console project
- Your app running locally or deployed

## Step 1: Set up Google OAuth in Google Cloud Console

1. **Go to Google Cloud Console**

   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google+ API**

   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
   - Also enable "Google Identity Toolkit API"

3. **Create OAuth 2.0 Credentials**

   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application" as the application type

4. **Configure OAuth Consent Screen**

   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in the required information:
     - App name: "Your App Name"
     - User support email: Your email
     - Developer contact information: Your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if needed

5. **Set up OAuth 2.0 Client ID**

   - Application type: Web application
   - Name: "Your App Name - Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://your-domain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/callback` (for development)
     - `https://your-domain.com/auth/callback` (for production)
     - `https://your-project-ref.supabase.co/auth/v1/callback` (Supabase callback)

6. **Save your credentials**
   - Note down your Client ID and Client Secret

## Step 2: Configure Supabase

1. **Go to your Supabase Dashboard**

   - Visit [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Enable Google Provider**

   - Go to "Authentication" > "Providers"
   - Find "Google" in the list and enable it
   - Enter your Google Client ID and Client Secret
   - Save the configuration
   - Callback URL: https://dwagglglwzenqhxjfhyi.supabase.co/auth/v1/callback

3. **Configure Site URL**
   - Go to "Authentication" > "URL Configuration"
   - Set your Site URL:
     - Development: `http://localhost:3000`
     - Production: `https://your-domain.com`
   - Add redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `https://your-domain.com/auth/callback`

## Step 3: Environment Variables

Add these environment variables to your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 4: Test the Integration

1. **Start your development server**

   ```bash
   npm run dev
   ```

2. **Test the flow**
   - Go to `/auth/sign-in` or `/auth/sign-up`
   - Click the "Continue with Google" button
   - You should be redirected to Google's OAuth consent screen
   - After authorization, you should be redirected back to your app

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**

   - Make sure the redirect URI in Google Cloud Console matches exactly
   - Include both your app's callback URL and Supabase's callback URL

2. **"OAuth consent screen not configured"**

   - Complete the OAuth consent screen setup in Google Cloud Console
   - Add your email as a test user if in testing mode

3. **"Provider not enabled"**

   - Make sure Google provider is enabled in Supabase dashboard
   - Verify Client ID and Client Secret are correct

4. **Redirect loop**
   - Check that your callback page (`/auth/callback`) is working correctly
   - Verify the redirect URL in the GoogleSignIn component

### Debug Steps

1. Check browser console for errors
2. Verify Supabase logs in the dashboard
3. Test with a fresh incognito window
4. Ensure all environment variables are set correctly

## Security Considerations

1. **Never commit secrets to version control**

   - Keep your Client Secret secure
   - Use environment variables for all sensitive data

2. **Use HTTPS in production**

   - Google OAuth requires HTTPS for production environments
   - Local development can use HTTP

3. **Configure proper redirect URIs**
   - Only allow redirects to your own domains
   - Remove any unused redirect URIs

## Additional Configuration

### Custom Scopes

If you need additional user data, you can modify the scopes in the GoogleSignIn component:

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    scopes: "email profile openid", // Add additional scopes here
  },
});
```

### User Metadata

When users sign in with Google, their profile information is automatically available in the user metadata. You can access it like this:

```typescript
const {
  data: { user },
} = await supabase.auth.getUser();
console.log(user?.user_metadata); // Contains Google profile data
```

## Support

If you encounter issues:

1. Check the [Supabase Auth documentation](https://supabase.com/docs/guides/auth)
2. Review [Google OAuth documentation](https://developers.google.com/identity/protocols/oauth2)
3. Check the Supabase community forums
