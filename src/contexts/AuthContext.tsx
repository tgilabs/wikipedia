import React, { createContext, useContext, useEffect, useState } from 'react';

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  avatarUrl: string | null;
}

interface AuthContextType {
  user: DiscordUser | null;
  loading: boolean;
  roles: string[];
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const response = await fetch('/api/discord-verify', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setRoles(data.roles || []);
      } else {
        setUser(null);
        setRoles([]);
      }
    } catch (error) {
      console.error('Failed to verify session:', error);
      setUser(null);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }

  function login() {
    window.location.href = '/api/discord-login';
  }

  function logout() {
    window.location.href = '/api/discord-logout';
  }

  return (
    <AuthContext.Provider value={{ user, loading, roles, login, logout }}>
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
