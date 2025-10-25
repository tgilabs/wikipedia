import React, { useEffect, useState } from 'react';

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

// Access environment variables through window object (set in docusaurus.config.ts)
const getEnvVar = (key: string): string => {
  if (typeof window !== 'undefined') {
    return (window as any).env?.[key] || '';
  }
  return '';
};

const DISCORD_CLIENT_ID = getEnvVar('DISCORD_CLIENT_ID');
const DISCORD_CLIENT_SECRET = getEnvVar('DISCORD_CLIENT_SECRET');
const DISCORD_GUILD_ID = getEnvVar('DISCORD_GUILD_ID');
const DISCORD_REQUIRED_ROLE_ID = getEnvVar('DISCORD_REQUIRED_ROLE_ID');
const DISCORD_REDIRECT_URI = typeof window !== 'undefined' 
  ? `${window.location.origin}/dashboard` 
  : '';

export default function DiscordAuth({ onAuthSuccess }: DiscordAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        `https://discord.com/api/users/@me/guilds/${DISCORD_GUILD_ID}/member`,
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
      if (!memberData.roles || !memberData.roles.includes(DISCORD_REQUIRED_ROLE_ID)) {
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
          client_id: DISCORD_CLIENT_ID,
          client_secret: DISCORD_CLIENT_SECRET,
          grant_type: 'authorization_code',
          code,
          redirect_uri: DISCORD_REDIRECT_URI,
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
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      DISCORD_REDIRECT_URI
    )}&response_type=code&scope=identify%20email%20guilds%20guilds.members.read`;
    
    window.location.href = authUrl;
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>מאמת...</h2>
          <p style={styles.text}>אנא המתן בזמן שאנחנו מאמתים את החשבון שלך</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>שגיאת אימות</h2>
          <p style={styles.errorText}>{error}</p>
          <button onClick={handleLogin} style={styles.button}>
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>מערכת ניהול התוכן של TeGriAI</h1>
        <p style={styles.text}>התחבר עם Discord כדי להתחיל לערוך</p>
        <button onClick={handleLogin} style={styles.button}>
          <i className="fab fa-discord" style={{ marginLeft: '10px' }}></i>
          התחבר עם Discord
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'var(--ifm-font-family-base)',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '500px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  },
  title: {
    color: '#ffffff',
    marginBottom: '20px',
    fontSize: '2rem',
  },
  text: {
    color: '#ffffff',
    marginBottom: '30px',
    fontSize: '1.1rem',
    opacity: 0.9,
  },
  errorText: {
    color: '#ffcccc',
    marginBottom: '20px',
    fontSize: '1rem',
  },
  button: {
    background: '#5865F2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '15px 30px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
