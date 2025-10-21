import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

interface SessionPayload {
  userId: string;
  username: string;
  discriminator: string;
  avatar: string;
  guildId: string;
  roles: string[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const cookies = parse(req.headers.cookie || '');
  const sessionToken = cookies.cms_session;

  if (!sessionToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const jwtSecret = process.env.JWT_SECRET!;

  try {
    const payload = jwt.verify(sessionToken, jwtSecret) as SessionPayload;
    
    return res.status(200).json({
      authenticated: true,
      user: {
        id: payload.userId,
        username: payload.username,
        discriminator: payload.discriminator,
        avatar: payload.avatar,
        avatarUrl: payload.avatar
          ? `https://cdn.discordapp.com/avatars/${payload.userId}/${payload.avatar}.png`
          : null,
      },
      roles: payload.roles,
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid session' });
  }
}
