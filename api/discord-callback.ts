import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  email?: string;
}

interface DiscordGuildMember {
  user: DiscordUser;
  roles: string[];
  nick?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  const clientId = process.env.DISCORD_CLIENT_ID!;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET!;
  const redirectUri = process.env.DISCORD_REDIRECT_URI || 'https://wiki.tegriai.com/api/discord-callback';
  const requiredGuildId = process.env.DISCORD_GUILD_ID!;
  const requiredRoleId = process.env.DISCORD_REQUIRED_ROLE_ID!;
  const jwtSecret = process.env.JWT_SECRET!;

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData: DiscordTokenResponse = await tokenResponse.json();

    // Get user information
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData: DiscordUser = await userResponse.json();

    // Check if user is a member of the required guild and has the required role
    const guildMemberResponse = await fetch(
      `https://discord.com/api/users/@me/guilds/${requiredGuildId}/member`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    if (!guildMemberResponse.ok) {
      // User is not a member of the required guild
      return res.redirect('/cms?error=not_member');
    }

    const guildMemberData: DiscordGuildMember = await guildMemberResponse.json();

    // Check if user has the required role
    if (!guildMemberData.roles.includes(requiredRoleId)) {
      return res.redirect('/cms?error=insufficient_role');
    }

    // Create JWT session token
    const sessionToken = jwt.sign(
      {
        userId: userData.id,
        username: userData.username,
        discriminator: userData.discriminator,
        avatar: userData.avatar,
        guildId: requiredGuildId,
        roles: guildMemberData.roles,
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    const cookie = serialize('cms_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    res.redirect('/cms?success=true');
  } catch (error) {
    console.error('Discord OAuth error:', error);
    res.redirect('/cms?error=auth_failed');
  }
}
