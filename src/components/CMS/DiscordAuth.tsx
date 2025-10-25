import React, { useEffect, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import './DiscordAuth.css';

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  email?: string;
}

interface DiscordAuthProps {
  onAuthSuccess: (user: DiscordUser, token: string) => void;
}

export default function DiscordAuth({ onAuthSuccess }: DiscordAuthProps) {
  const { siteConfig } = useDocusaurusContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get config directly from Docusaurus context
  const config = {
    clientId: (siteConfig.customFields?.DISCORD_CLIENT_ID as string) || '',
    clientSecret: (siteConfig.customFields?.DISCORD_CLIENT_SECRET as string) || '',
    guildId: (siteConfig.customFields?.DISCORD_GUILD_ID as string) || '',
    requiredRoleId: (siteConfig.customFields?.DISCORD_REQUIRED_ROLE_ID as string) || '',
    redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : ''
  };

  useEffect(() => {
    console.log('Discord Config:', config);
    
    // Check if we have a code in the URL (OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      handleDiscordCallback(code);
    }
  }, []);

  const verifyUserAccess = async (accessToken: string, userId: string): Promise<boolean> => {
    try {
      // Get user's guild member information
      const guildMemberResponse = await fetch(
        `https://discord.com/api/users/@me/guilds/${config.guildId}/member`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!guildMemberResponse.ok) {
        console.error('User is not a member of the required guild');
        return false;
      }

      const memberData = await guildMemberResponse.json();
      
      // Check if user has the required role
      if (!memberData.roles || !memberData.roles.includes(config.requiredRoleId)) {
        console.error('User does not have the required role');
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error verifying user access:', err);
      return false;
    }
  };

  const handleDiscordCallback = async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Exchange code for access token
      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          grant_type: 'authorization_code',
          code,
          redirect_uri: config.redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Get user information
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user information');
      }

      const userData: DiscordUser = await userResponse.json();

      // Verify user is in the required server with the required role
      const hasAccess = await verifyUserAccess(accessToken, userData.id);
      
      if (!hasAccess) {
        throw new Error('אין לך הרשאות גישה. עליך להיות חבר בשרת Discord ולהחזיק בתפקיד הנדרש.');
      }

      // Store token in localStorage
      localStorage.setItem('discord_token', accessToken);
      localStorage.setItem('discord_user', JSON.stringify(userData));

      // Clean up URL
      window.history.replaceState({}, document.title, '/dashboard');

      onAuthSuccess(userData, accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    console.log('Current config:', config);
    console.log('Window env:', (window as any).env);
    
    if (!config.clientId) {
      alert('שגיאה: Discord Client ID חסר. אנא בדוק את הגדרות הסביבה.');
      return;
    }
    
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(
      config.redirectUri
    )}&response_type=code&scope=identify%20email%20guilds%20guilds.members.read`;
    
    console.log('Auth URL:', authUrl);
    window.location.href = authUrl;
  };

  if (isLoading) {
    return (
      <div className="discord-auth-container">
        <div className="discord-auth-card">
          <h2 className="discord-auth-title">מאמת...</h2>
          <p className="discord-auth-text">אנא המתן בזמן שאנחנו מאמתים את החשבון שלך</p>
          <div className="discord-auth-spinner">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="discord-auth-container">
        <div className="discord-auth-card">
          <h2 className="discord-auth-title">שגיאת אימות</h2>
          <p className="discord-auth-error">{error}</p>
          <button onClick={handleLogin} className="discord-login-button">
            <i className="fas fa-redo" style={{ marginLeft: '8px' }}></i>
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="discord-auth-container">
      <div className="discord-auth-card">
        <h1 className="discord-auth-title">מערכת ניהול התוכן של TeGriAI</h1>
        <p className="discord-auth-text">התחבר עם Discord כדי להתחיל לערוך</p>
        <button onClick={handleLogin} className="discord-login-button">
          <i className="fab fa-discord" style={{ marginLeft: '10px' }}></i>
          התחבר עם Discord
        </button>
      </div>
    </div>
  );
}
