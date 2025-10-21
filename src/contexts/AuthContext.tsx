import React, { createContext, useContext, useEffect, useState } from 'react';
import { account } from '../lib/appwrite';
import type { Models } from 'appwrite';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  hasRequiredRole: boolean;
  roleCheckLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkDiscordRole: (accessToken: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);
  const [roleCheckLoading, setRoleCheckLoading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      
      // Check if we have a stored role verification
      const roleVerified = localStorage.getItem('discord_role_verified');
      if (roleVerified === 'true') {
        setHasRequiredRole(true);
      }
    } catch (error) {
      setUser(null);
      setHasRequiredRole(false);
      localStorage.removeItem('discord_role_verified');
    } finally {
      setLoading(false);
    }
  }

  async function checkDiscordRole(accessToken: string): Promise<boolean> {
    setRoleCheckLoading(true);
    
    const requiredGuildId = process.env.DISCORD_GUILD_ID;
    const requiredRoleId = process.env.DISCORD_REQUIRED_ROLE_ID;

    if (!requiredGuildId || !requiredRoleId) {
      console.error('Discord guild ID or role ID not configured');
      setRoleCheckLoading(false);
      return false;
    }

    try {
      // Check if user is a member of the required guild and has the required role
      const response = await fetch(
        `https://discord.com/api/users/@me/guilds/${requiredGuildId}/member`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        // User is not a member of the required guild
        setHasRequiredRole(false);
        localStorage.removeItem('discord_role_verified');
        setRoleCheckLoading(false);
        return false;
      }

      const memberData = await response.json();
      const hasRole = memberData.roles.includes(requiredRoleId);

      setHasRequiredRole(hasRole);
      if (hasRole) {
        localStorage.setItem('discord_role_verified', 'true');
      } else {
        localStorage.removeItem('discord_role_verified');
      }

      setRoleCheckLoading(false);
      return hasRole;
    } catch (error) {
      console.error('Failed to check Discord role:', error);
      setHasRequiredRole(false);
      localStorage.removeItem('discord_role_verified');
      setRoleCheckLoading(false);
      return false;
    }
  }

  async function login() {
    try {
      // Redirect to Discord OAuth
      account.createOAuth2Session(
        'discord',
        `${window.location.origin}/cms`,
        `${window.location.origin}/cms`
      );
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      await account.deleteSession('current');
      setUser(null);
      setHasRequiredRole(false);
      localStorage.removeItem('discord_role_verified');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, hasRequiredRole, roleCheckLoading, login, logout, checkDiscordRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
