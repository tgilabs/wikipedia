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

Decap CMS uses GitHub OAuth for authentication. You have two options:

### Option 1: Netlify (Easiest)

If you're deploying to Netlify, authentication is handled automatically. Just:
1. Deploy your site to Netlify
2. Enable Identity in your Netlify site settings
3. Configure GitHub as the Git Gateway

### Option 2: Cloudflare Worker (Lightweight)

For a custom OAuth solution using Cloudflare Workers:

#### Step 1: Create GitHub OAuth Application

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Your site name
   - **Homepage URL**: `https://yourdomain.com`
   - **Authorization callback URL**: `https://auth.yourdomain.com/callback`
4. Save the **Client ID** and **Client Secret**

#### Step 2: Deploy Cloudflare Worker

Create a Cloudflare Worker with the following code structure:

```javascript
// Your worker needs to handle two routes:
// 1. /auth - Redirects to GitHub OAuth
// 2. /callback - Receives auth code and sends to popup window

const CLIENT_ID = 'your_github_client_id';
const CLIENT_SECRET = 'your_github_client_secret';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    if (url.pathname === '/auth') {
      // Redirect to GitHub OAuth
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user`;
      return Response.redirect(authUrl, 302);
    }
    
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      
      // Exchange code for access token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
        }),
      });
      
      const data = await tokenResponse.json();
      
      // Send token back to CMS popup window
      return new Response(`
        <html>
          <script>
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify(data)}',
              window.location.origin
            );
            window.close();
          </script>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
      });
    }
    
    return new Response('Not Found', { status: 404 });
  },
};
```

#### Step 3: Update CMS Config

Update `static/admin/config.yml` to use your OAuth proxy:

```yaml
backend:
  name: github
  repo: tgilabs/wikipedia
  branch: Production
  base_url: https://auth.yourdomain.com
  auth_endpoint: /auth
```

For more details, see the [Cloudflare Worker OAuth template](https://github.com/i40west/netlify-cms-cloudflare-pages).

### Option 3: Local Development (Test Mode)

For local testing without authentication, update the config:

```yaml
backend:
  name: test-repo
```

This creates a local Git repository in your browser's localStorage.

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
