# Decap CMS Setup

This project uses [Decap CMS](https://decapcms.org/) (formerly Netlify CMS) for content management.

## Overview

Decap CMS provides a user-friendly interface for managing your Docusaurus content directly through GitHub. All content is stored in the repository and changes are made via GitHub commits and pull requests.

## Access the CMS

Once deployed, you can access the CMS at:
```
https://yourdomain.com/admin/
```

For local development:
```
http://localhost:3000/admin/
```

## Authentication Setup

Decap CMS uses GitHub OAuth for authentication. Since you're using Cloudflare, follow these steps:

### Set up Cloudflare Worker OAuth Proxy

#### Step 1: Create GitHub OAuth Application

1. Go to GitHub Settings → Developer settings → OAuth Apps → New OAuth App
2. Fill in the details:
   - **Application name**: `Your Site Name CMS`
   - **Homepage URL**: `https://yourdomain.com`
   - **Authorization callback URL**: `https://your-auth-worker.workers.dev/callback`
3. Click "Register application"
4. Save the **Client ID** and generate a **Client Secret** (save it securely!)

#### Step 2: Deploy Cloudflare Worker

1. **Create a new Cloudflare Worker**:
   - Go to Cloudflare Dashboard → Workers & Pages
   - Click "Create Application" → "Create Worker"
   - Name it (e.g., `decap-cms-oauth`)

2. **Add the OAuth handler code**:
   - Use the code from `cloudflare-worker-oauth.js` in your project root
   - Or copy from the template below

3. **Configure environment variables**:
   In the Worker settings, add these secrets:
   ```
   CLIENT_ID=your_github_client_id
   CLIENT_SECRET=your_github_client_secret
   ALLOWED_ORIGIN=https://yourdomain.com
   ```

4. **Deploy the worker** and note your worker URL (e.g., `https://decap-cms-oauth.your-subdomain.workers.dev`)

#### Step 3: Update Decap CMS Configuration

Edit `static/admin/config.yml` and update the backend section:

```yaml
backend:
  name: github
  repo: tgilabs/wikipedia
  branch: Production
  base_url: https://your-auth-worker.workers.dev
  auth_endpoint: /auth
```

Replace `https://your-auth-worker.workers.dev` with your actual Cloudflare Worker URL.

#### Step 4: Test the Setup

1. Build and deploy your site
2. Visit `https://yourdomain.com/admin/`
3. Click "Login with GitHub"
4. Authorize the application
5. You should be redirected back to the CMS

### Alternative: Local Development (Test Mode)

For local testing without OAuth, update `static/admin/config.yml`:

```yaml
backend:
  name: test-repo
```

This creates a local Git repository in your browser's localStorage. Changes won't be saved to GitHub.

## Content Collections

The CMS is configured to manage:

- **Blog**: Blog posts in `/blog`
- **Community Docs**: Documentation in `/docs/community`
- **Gaming Docs**: Documentation in `/docs/gaming`
- **Legal Docs**: Documentation in `/docs/legal`
- **Platforms Docs**: Documentation in `/docs/platforms`

## Editorial Workflow

The CMS uses an editorial workflow with three states:
- **Drafts**: Work in progress
- **In Review**: Ready for review
- **Ready**: Approved and ready to publish

Each state corresponds to a pull request status in GitHub.

## Media Files

Uploaded images and files are stored in `/static/img` and accessible at `/img/filename.ext`.

## Configuration

Edit `static/admin/config.yml` to:
- Add new content collections
- Modify field types
- Configure widget options
- Change media storage location

## Resources

- [Decap CMS Documentation](https://decapcms.org/docs/)
- [Configuration Options](https://decapcms.org/docs/configuration-options/)
- [Widget Reference](https://decapcms.org/docs/widgets/)
- [Backend Configuration](https://decapcms.org/docs/backends-overview/)
