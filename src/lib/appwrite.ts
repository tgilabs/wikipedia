import { Client, Account, Databases } from 'appwrite';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Get config from Docusaurus
const getConfig = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use window.docusaurus
    return (window as any)?.docusaurus?.siteConfig?.customFields || {};
  }
  return {};
};

// Initialize Appwrite client
const client = new Client();

// Lazy initialization
export const initializeAppwrite = () => {
  const config = getConfig();
  client
    .setEndpoint((config.APPWRITE_ENDPOINT as string) || 'https://cloud.appwrite.io/v1')
    .setProject((config.APPWRITE_PROJECT_ID as string) || '');
};

// Initialize on module load if in browser
if (typeof window !== 'undefined') {
  initializeAppwrite();
}

export const account = new Account(client);
export const databases = new Databases(client);

export { client };

export default client;
