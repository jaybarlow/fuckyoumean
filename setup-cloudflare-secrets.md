# Setting Up GitHub Secrets for Cloudflare Pages Deployment

To use the GitHub Actions workflow for deploying to Cloudflare Pages, you need to set up the following secrets in your GitHub repository:

## Required Secrets

1. **CLOUDFLARE_API_TOKEN**: An API token with Pages deployment permissions
2. **CLOUDFLARE_ACCOUNT_ID**: Your Cloudflare account ID
3. **CLOUDFLARE_PROJECT_NAME**: The name of your Cloudflare Pages project
4. **NEXT_PUBLIC_SUPABASE_URL**: Your Supabase project URL
5. **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Your Supabase anonymous key
6. **NEXT_PUBLIC_SITE_URL**: Your Cloudflare Pages URL or custom domain

## How to Set Up Secrets

1. Go to your GitHub repository
2. Click on **Settings**
3. In the left sidebar, click on **Secrets and variables** → **Actions**
4. Click on **New repository secret**
5. Add each of the secrets listed above

## How to Get Cloudflare Values

### CLOUDFLARE_API_TOKEN

1. Go to your Cloudflare dashboard
2. Click on your profile icon in the top right
3. Select **My Profile**
4. Click on **API Tokens** tab
5. Click **Create Token**
6. Select **Create Custom Token**
7. Give it a name like "GitHub Pages Deployment"
8. Under **Permissions**, add:
   - Account > Cloudflare Pages > Edit
   - Account > Account Settings > Read
9. Click **Continue to summary** and then **Create Token**
10. Copy the token value (you won't be able to see it again)

### CLOUDFLARE_ACCOUNT_ID

1. Go to your Cloudflare dashboard
2. Your Account ID is in the URL: `https://dash.cloudflare.com/<ACCOUNT_ID>/...`
3. Or look at the right sidebar on the dashboard homepage

### CLOUDFLARE_PROJECT_NAME

This is the name you gave your Cloudflare Pages project when you created it.

## Testing the Workflow

After setting up all the secrets:

1. Push a commit to your main branch
2. Go to the **Actions** tab in your GitHub repository
3. You should see the workflow running
4. Once completed, your site should be deployed to Cloudflare Pages 