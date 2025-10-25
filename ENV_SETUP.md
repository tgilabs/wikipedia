# Environment Variables Setup

## How Environment Variables Work

This CMS uses Docusaurus's `customFields` feature to expose environment variables to the client-side.

### Flow:

1. **`.env` file** - Store your secrets here (never commit this!)
2. **`docusaurus.config.ts`** - Reads from `.env` and exposes via `customFields`
3. **`src/theme/Root.tsx`** - Injects `customFields` into `window.env` object
4. **Components** - Access via `window.env.VARIABLE_NAME`

### Required Variables:

```bash
# Discord OAuth
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# Discord Server & Role Verification  
DISCORD_GUILD_ID=418801915162263574
DISCORD_REQUIRED_ROLE_ID=507964393300951040

# GitHub API
GITHUB_TOKEN=your_github_personal_access_token
```

## Security Note

⚠️ **Important**: These variables are exposed to the client-side (browser). 

- Discord Client Secret: Used only for OAuth token exchange (standard practice)
- GitHub Token: Should be a bot account token with minimal permissions (only PR creation)
- Never use your personal GitHub token with admin access!

## Troubleshooting

**Error: "process is not defined"**
- ✅ FIXED: We now use `window.env` instead of `process.env`

**Variables showing as undefined:**
1. Check `.env` file exists and has all variables
2. Restart the dev server (`pnpm start`)
3. Check browser console: `console.log(window.env)`

**After deployment:**
- Set environment variables in your hosting platform (Vercel, Netlify, etc.)
- They will be injected during build time
