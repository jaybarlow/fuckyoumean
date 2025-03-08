# Deploying to Cloudflare Pages

This guide will walk you through deploying your Next.js application with Supabase authentication to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account (sign up at [cloudflare.com](https://cloudflare.com))
2. Your code pushed to a GitHub repository
3. Your Supabase project set up and configured

## Step 1: Connect your GitHub repository to Cloudflare Pages

1. Log in to your Cloudflare dashboard
2. Navigate to **Pages** from the sidebar
3. Click **Create a project**
4. Select **Connect to Git**
5. Connect your GitHub account if not already connected
6. Select the repository containing your Next.js application
7. Click **Begin setup**

## Step 2: Configure your build settings

In the build settings page:

1. Set **Project name** to your preferred name (e.g., `shadow-site`)
2. Set **Production branch** to your main branch (usually `main` or `master`)
3. Set **Framework preset** to `Next.js`
4. Set **Build command** to `npm run build`
5. Set **Build output directory** to `.next` (or `out` if you're using static export)
6. Set **Node.js version** to `18` (or your preferred version)

## Step 3: Add environment variables

Add the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-cloudflare-pages-url.pages.dev
```

For production, update `NEXT_PUBLIC_SITE_URL` to your custom domain once it's set up.

## Step 4: Deploy your site

1. Click **Save and Deploy**
2. Wait for the build and deployment to complete

## Step 5: Configure Supabase authentication redirect URLs

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Cloudflare Pages URL to the **Site URL** field:
   ```
   https://your-cloudflare-pages-url.pages.dev
   ```
4. Add the following redirect URLs:
   ```
   https://your-cloudflare-pages-url.pages.dev/auth/callback
   https://your-cloudflare-pages-url.pages.dev/auth/reset-password
   ```
5. Click **Save**

## Step 6: Set up a custom domain (optional)

1. In your Cloudflare Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain name and follow the instructions
4. Update your Supabase site URL and redirect URLs with your custom domain

## Step 7: Enable compatibility flags (if needed)

If you encounter issues with Next.js on Cloudflare Pages, you may need to add compatibility flags:

1. Create a `next.config.js` file in your project root (if it doesn't exist)
2. Add the following configuration:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable Cloudflare compatibility
  experimental: {
    runtime: 'experimental-edge',
  },
}

module.exports = nextConfig
```

## Troubleshooting

### Cookie issues

If you encounter cookie-related issues:

1. Make sure your cookies are using the `same-site` attribute correctly
2. Check that your cookies don't exceed size limits
3. Verify that your middleware is compatible with Cloudflare's environment

### Authentication redirects

If authentication redirects aren't working:

1. Double-check your Supabase redirect URLs
2. Ensure `NEXT_PUBLIC_SITE_URL` is set correctly
3. Verify that your callback routes are properly configured

### Build failures

If your build fails:

1. Check the build logs for specific errors
2. Make sure you're using a compatible Node.js version
3. Verify that all dependencies are properly installed

## Additional Resources

- [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/)
- [Supabase authentication documentation](https://supabase.com/docs/guides/auth) 