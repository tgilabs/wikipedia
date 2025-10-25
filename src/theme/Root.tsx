import React, { useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Default implementation, that you can customize
export default function Root({ children }) {
  const { siteConfig } = useDocusaurusContext();

  useEffect(() => {
    // Inject environment variables into window object for client-side access
    if (typeof window !== 'undefined') {
      (window as any).env = {
        DISCORD_CLIENT_ID: siteConfig.customFields?.DISCORD_CLIENT_ID,
        DISCORD_CLIENT_SECRET: siteConfig.customFields?.DISCORD_CLIENT_SECRET,
        DISCORD_GUILD_ID: siteConfig.customFields?.DISCORD_GUILD_ID,
        DISCORD_REQUIRED_ROLE_ID: siteConfig.customFields?.DISCORD_REQUIRED_ROLE_ID,
        GITHUB_TOKEN: siteConfig.customFields?.GITHUB_TOKEN,
      };
    }
  }, [siteConfig]);

  return <>{children}</>;
}
