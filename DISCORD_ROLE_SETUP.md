# Discord Role-Based Access Control Setup

This guide explains how to set up Discord role verification for your CMS using Appwrite OAuth.

## How It Works

1. **User logs in** → Appwrite handles Discord OAuth
2. **After login** → System checks if user has the required role in your Discord server
3. **Access granted** → Only users with the specified role can use the CMS

## Setup Steps

### 1. Configure Appwrite Discord OAuth (5 minutes)

1. **Go to your Appwrite Console**
   - Navigate to: https://cloud.appwrite.io
   - Select your project (ID: `labs` based on your MCP config)

2. **Enable Discord OAuth**
   - Go to **Auth → Settings → OAuth2 Providers**
   - Find and enable **Discord**
   - Click on Discord to configure

3. **Create Discord Application**
   - Visit https://discord.com/developers/applications
   - Click "New Application"
   - Name it (e.g., "TeGriAi Wiki CMS")

4. **Configure OAuth2 in Discord**
   - Go to **OAuth2** section in your Discord app
   - Copy the **Client ID** and **Client Secret**
   - Add redirect URI: `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/discord/labs`
   - Required scopes will be set by Appwrite automatically

5. **Add Credentials to Appwrite**
   - Back in Appwrite Discord OAuth settings
   - Paste **Client ID** and **Client Secret**
   - Success redirect: `https://wiki.tegriai.com/cms`
   - Failure redirect: `https://wiki.tegriai.com/cms?error=auth_failed`
   - Save the configuration

### 2. Get Your Discord Server and Role IDs (3 minutes)

#### Enable Developer Mode in Discord
1. Open Discord
2. User Settings → Advanced → Enable Developer Mode

#### Get Server (Guild) ID
1. Right-click your server name
2. Click "Copy Server ID"
3. Save this as `DISCORD_GUILD_ID`

#### Get Role ID
1. Go to Server Settings → Roles
2. Find the role you want to require (e.g., "Wiki Editor", "Admin", etc.)
3. Right-click the role → "Copy Role ID"
4. Save this as `DISCORD_REQUIRED_ROLE_ID`

### 3. Configure Environment Variables (1 minute)

Create a `.env` file in your project root:

```bash
cp .env.example .env
```

Edit `.env` and add:

```env
# Appwrite (already configured in your MCP)
APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=labs

# Discord Server/Role Configuration
DISCORD_GUILD_ID=123456789012345678  # Your server ID
DISCORD_REQUIRED_ROLE_ID=987654321098765432  # Your required role ID

# GitHub
GITHUB_OWNER=tgilabs
GITHUB_REPO=wikipedia
GITHUB_BRANCH=Production
```

### 4. How Users Access the CMS

1. **User navigates to** `/cms`
2. **Clicks** "Login with Discord"
3. **Discord OAuth** → User authorizes the application
4. **Role Check** → System automatically verifies:
   - Is user a member of the specified server?
   - Does user have the required role?
5. **Access Decision**:
   - ✅ **Has role** → Full CMS access granted
   - ❌ **No role** → Shows error message with instructions

## User Experience

### For Authorized Users
```
1. Click "Login with Discord"
2. Authorize on Discord
3. Automatically redirected to CMS
4. Can edit documentation immediately
```

### For Unauthorized Users
```
1. Click "Login with Discord"
2. Authorize on Discord
3. See message: "You need the [Role Name] role in [Server Name] to access this CMS"
4. Instructions to contact admin for access
```

## Security Features

- ✅ **Role verification** happens on every login
- ✅ **Server membership** is verified
- ✅ **OAuth tokens** are managed securely by Appwrite
- ✅ **No backend needed** - all verification happens client-side with Discord API
- ✅ **Role changes sync** - removing a user's role immediately revokes access

## Testing

### Test the Setup

1. **Start development server:**
   ```bash
   pnpm start
   ```

2. **Navigate to:**
   ```
   http://localhost:3000/cms
   ```

3. **Test scenarios:**
   - ✅ Login with user who has the required role
   - ❌ Login with user who doesn't have the role
   - ❌ Login with user who's not in the server

## Troubleshooting

### "Not a member of required server"
- User needs to join your Discord server first
- Verify `DISCORD_GUILD_ID` is correct

### "Missing required role"
- User needs the specified role in your server
- Check `DISCORD_REQUIRED_ROLE_ID` matches the role
- Verify the role is assigned in Discord server

### Discord OAuth fails
- Check Appwrite Discord OAuth configuration
- Verify redirect URLs match exactly
- Ensure Discord app has correct Client ID/Secret

### Role check not working
- Verify Discord Developer Mode is enabled
- Double-check role ID and guild ID
- Make sure Discord OAuth includes `guilds.members.read` scope

## Advanced: Multiple Roles

To allow multiple roles (e.g., "Admin" OR "Editor"):

1. Get both role IDs from Discord
2. Update the role check logic in `AuthContext.tsx`:

```typescript
// Instead of single role:
const hasRole = memberData.roles.includes(requiredRoleId);

// Check multiple roles:
const allowedRoles = [
  'ROLE_ID_1',  // Admin
  'ROLE_ID_2',  // Editor
];
const hasRole = memberData.roles.some(roleId => allowedRoles.includes(roleId));
```

## Benefits of This Approach

1. **No backend required** - Uses Appwrite OAuth + Discord API
2. **Real-time verification** - Role changes take effect immediately
3. **Simple management** - Just manage Discord roles, no separate whitelist
4. **Scalable** - Works for any number of users
5. **Discord-native** - Uses your existing Discord server structure

## Next Steps

After setup:
1. Assign the required role to team members in Discord
2. Share the CMS URL (`/cms`) with your team
3. Users can log in with Discord and start editing!

---

**Questions?** Check the main [CMS_SETUP.md](./CMS_SETUP.md) for general CMS usage.
