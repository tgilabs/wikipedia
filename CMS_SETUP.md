# Custom CMS Setup Guide

This project now uses a custom CMS solution instead of Decap CMS, with Discord authentication and GitHub PR-based workflow.

## Features

✅ **Discord Authentication** - Users log in with their Discord account
✅ **TipTap Rich Text Editor** - Modern markdown editor with formatting toolbar
✅ **File Browser** - Navigate and select markdown files from the repository
✅ **GitHub PR Workflow** - Changes are submitted as Pull Requests
✅ **PR Status Tracking** - Users can track the status of their submitted PRs
✅ **Hebrew RTL Support** - Fully supports right-to-left text editing

## Setup Instructions

### 1. Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name (e.g., "TeGriAI Wiki CMS")
3. Go to "OAuth2" section
4. Add redirect URL: `http://localhost:3000/admin` (for development)
5. Add redirect URL: `https://wiki.tegriai.com/admin` (for production)
6. Copy your **Client ID** and **Client Secret**

### 2. Create a GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Fine-grained tokens](https://github.com/settings/tokens?type=beta)
2. Click "Generate new token"
3. Give it a name (e.g., "Wiki CMS Bot")
4. Set repository access to "Only select repositories" and choose `tgilabs/wikipedia`
5. Grant the following permissions:
   - **Contents**: Read and write
   - **Pull requests**: Read and write
   - **Metadata**: Read-only (automatically selected)
6. Click "Generate token" and copy it

### 3. Configure Environment Variables

Create a `.env` file in the root of your project:

```bash
# Discord OAuth
REACT_APP_DISCORD_CLIENT_ID=your_discord_client_id
REACT_APP_DISCORD_CLIENT_SECRET=your_discord_client_secret

# GitHub API (for creating PRs)
REACT_APP_GITHUB_TOKEN=your_github_personal_access_token
```

**⚠️ IMPORTANT:** Add `.env` to your `.gitignore` file to keep secrets safe!

### 4. Update Production Environment

For production deployment (Vercel, Netlify, etc.), add these environment variables in your hosting platform's settings.

**Vercel:**
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable with the appropriate value

**Netlify:**
1. Go to Site settings > Build & deploy > Environment
2. Add each variable

## Usage

### Access the CMS

Navigate to `/admin` on your website:
- Development: `http://localhost:3000/admin`
- Production: `https://wiki.tegriai.com/admin`

### Workflow

1. **Login** - Click "Login with Discord" and authorize the application
2. **Browse** - Use the file browser on the left to find the file you want to edit
3. **Edit** - Modify the title, sidebar position, and content using the rich text editor
4. **Submit** - Click "Submit for Approval" to create a Pull Request
5. **Track** - Click "My PRs" to see the status of your submissions
6. **Wait** - Repository maintainers will review and merge your PR

### For Repository Maintainers

When users submit changes:
1. You'll receive a GitHub notification about a new PR
2. Review the changes in the GitHub PR interface
3. Approve and merge if the changes are acceptable
4. The changes will automatically be deployed

## File Structure

```
src/
├── components/
│   └── CMS/
│       ├── DiscordAuth.tsx      # Discord OAuth login
│       ├── FileBrowser.tsx       # Repository file browser
│       ├── FileBrowser.css
│       ├── MarkdownEditor.tsx    # TipTap rich text editor
│       ├── MarkdownEditor.css
│       └── GitHubService.ts      # GitHub API integration
├── pages/
│   ├── admin.tsx                 # Main CMS page
│   └── admin.css
```

## Security Notes

- **Never commit** your `.env` file to Git
- The GitHub token should have **minimal permissions** (only what's needed)
- Discord OAuth credentials should be kept secret
- Users can only create PRs, not merge them directly
- All changes are reviewed before being merged

## Troubleshooting

### "Authentication failed"
- Check that your Discord Client ID and Client Secret are correct
- Verify that the redirect URI matches exactly (including protocol and path)

### "Failed to submit change"
- Ensure your GitHub token has the correct permissions
- Check that the token hasn't expired
- Verify the repository name and owner are correct

### Editor not loading
- Clear browser cache and localStorage
- Check browser console for errors
- Ensure all dependencies are installed (`pnpm install`)

## Development

Start the development server:
```bash
pnpm start
```

Build for production:
```bash
pnpm build
```

## Support

For issues or questions, contact the development team or open an issue in the repository.
