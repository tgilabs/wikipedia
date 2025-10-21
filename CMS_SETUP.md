# Docusaurus CMS Integration

This project has been enhanced with a Content Management System (CMS) that allows authenticated users to edit documentation directly through a web interface.

## Features

- 🔐 **Discord OAuth Authentication** via Appwrite
- ✏️ **Rich Text Editing** with Tiptap editor
- 🔄 **GitHub Sync** - Changes are committed directly to your repository
- 📁 **File Browser** - Navigate through your documentation structure
- 💾 **Auto-save** - Save changes directly to GitHub

## Setup Instructions

### 1. Appwrite Configuration

1. Create an account at [Appwrite Cloud](https://cloud.appwrite.io)
2. Create a new project
3. Enable Discord OAuth provider:
   - Go to Auth → Settings → OAuth2 Providers
   - Enable Discord
   - Add your Discord OAuth credentials
   - Set redirect URL: `https://your-domain.com/cms`
4. Copy your Project ID

### 2. Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or use existing
3. Go to OAuth2 section
4. Add redirect URI: `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/discord/[project-id]`
5. Copy Client ID and Client Secret
6. Add these to Appwrite Discord OAuth settings

### 3. GitHub Personal Access Token

1. Go to [GitHub Settings → Developer Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name: "Docusaurus CMS"
4. Select scopes: 
   - `repo` (Full control of private repositories)
5. Generate and copy the token
6. **Keep this token secure!**

### 4. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_appwrite_project_id

GITHUB_OWNER=tgilabs
GITHUB_REPO=wikipedia
GITHUB_BRANCH=Production
```

### 5. Build Configuration

Update your `docusaurus.config.ts` to include environment variables:

```typescript
customFields: {
  APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
}
```

## Usage

### Accessing the CMS

1. Navigate to `/cms` on your site
2. Click "Login with Discord"
3. Authorize with Discord
4. Enter your GitHub Personal Access Token (first time only)
5. Start editing!

### Editing Documentation

1. Browse files in the left sidebar
2. Click on a file to open it
3. Edit using the rich text editor
4. Click "Save Changes" to commit to GitHub
5. Changes will be automatically deployed

### Editor Features

The Tiptap editor supports:
- **Bold**, *Italic*, ~~Strikethrough~~
- Headings (H1, H2, H3)
- Bullet lists and numbered lists
- Code blocks
- Blockquotes
- Horizontal rules
- Undo/Redo

## Security Notes

⚠️ **Important Security Considerations:**

1. **GitHub Token Storage**: Currently, the GitHub token is stored in browser memory only. For production, consider:
   - Storing tokens encrypted in Appwrite Database
   - Using GitHub Apps instead of Personal Access Tokens
   - Implementing a backend proxy for GitHub API calls

2. **User Permissions**: Currently, any authenticated Discord user can edit. Consider:
   - Implementing role-based access control
   - Storing approved editors in Appwrite Database
   - Adding approval workflows

3. **Environment Variables**: Never commit `.env` to version control

## Architecture

```
┌─────────────┐
│   Browser   │
│   (React)   │
└──────┬──────┘
       │
       ├─────────────┐
       │             │
┌──────▼──────┐ ┌───▼──────┐
│  Appwrite   │ │  GitHub  │
│   (Auth)    │ │   (API)  │
└─────────────┘ └──────────┘
```

### Components

- **AuthContext**: Manages Discord authentication via Appwrite
- **GitHubService**: Handles all GitHub API operations
- **MarkdownEditor**: Tiptap-based editor with markdown support
- **CMS Dashboard**: Main interface for file browsing and editing

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm start

# Build for production
pnpm build
```

## Troubleshooting

### "GitHub service not initialized" error
- Make sure you've entered a valid GitHub Personal Access Token in the CMS

### Discord login not working
- Check Appwrite Discord OAuth configuration
- Verify redirect URLs match exactly
- Ensure Discord application has correct redirect URI

### Can't save files
- Verify GitHub token has `repo` scope
- Check that repository name and owner are correct
- Ensure branch name matches your default branch

## Future Enhancements

- [ ] Backend API for secure token management
- [ ] Role-based access control
- [ ] Draft/Preview mode before committing
- [ ] Image upload support
- [ ] Multi-file editing
- [ ] Change history and rollback
- [ ] Real-time collaboration
- [ ] Automated pull requests instead of direct commits

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

This project is licensed under CC-BY-4.0 license.
