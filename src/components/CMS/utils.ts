/**
 * Shared utility functions for CMS components
 */

/**
 * Decode base64 string with proper UTF-8 support
 * Handles Hebrew, Arabic, emojis, and all UTF-8 characters correctly
 */
export const decodeBase64UTF8 = (base64: string): string => {
  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch (error) {
    console.error('Error decoding base64:', error);
    return atob(base64); // Fallback
  }
};

/**
 * Encode string to base64 with proper UTF-8 support
 */
export const encodeBase64UTF8 = (str: string): string => {
  try {
    const utf8Bytes = new TextEncoder().encode(str);
    let binaryString = '';
    utf8Bytes.forEach(byte => {
      binaryString += String.fromCharCode(byte);
    });
    return btoa(binaryString);
  } catch (error) {
    console.error('Error encoding to base64:', error);
    return btoa(unescape(encodeURIComponent(str))); // Fallback
  }
};

/**
 * Check if a file path is within the allowed community folder
 */
export const isPathAllowed = (filePath: string): boolean => {
  return filePath.startsWith('docs/community/');
};

/**
 * Validate file name (no special characters except dash and underscore)
 */
export const validateFileName = (fileName: string): boolean => {
  const validPattern = /^[a-zA-Z0-9_-]+\.md$/;
  return validPattern.test(fileName);
};

/**
 * Parse frontmatter from markdown content
 */
export const parseFrontmatter = (content: string): {
  metadata: Record<string, any>;
  body: string;
} => {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, body: content };
  }

  const metadata: Record<string, any> = {};
  const frontmatter = match[1];
  const body = match[2];

  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();
    
    if (!key) return;

    // Remove quotes from string values
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      metadata[key] = value.slice(1, -1);
    } else if (!isNaN(Number(value))) {
      // Parse numbers
      metadata[key] = parseInt(value, 10);
    } else {
      // Keep as string
      metadata[key] = value;
    }
  });

  return { metadata, body };
};

/**
 * Build frontmatter string from metadata object
 */
export const buildFrontmatter = (metadata: Record<string, any>): string => {
  const keys = Object.keys(metadata).filter(key => 
    metadata[key] !== undefined && metadata[key] !== ''
  );
  
  if (keys.length === 0) return '';

  let frontmatter = '---\n';
  
  // Add fields in a specific order for consistency
  const orderedFields = ['title', 'sidebar_label', 'description', 'sidebar_position'];
  
  // Add ordered fields first
  orderedFields.forEach(field => {
    if (metadata[field] !== undefined && metadata[field] !== '') {
      const value = metadata[field];
      if (typeof value === 'string') {
        frontmatter += `${field}: "${value}"\n`;
      } else {
        frontmatter += `${field}: ${value}\n`;
      }
    }
  });
  
  // Add any other fields
  keys.forEach(key => {
    if (!orderedFields.includes(key)) {
      const value = metadata[key];
      if (typeof value === 'string') {
        frontmatter += `${key}: "${value}"\n`;
      } else {
        frontmatter += `${key}: ${value}\n`;
      }
    }
  });
  
  frontmatter += '---\n\n';
  return frontmatter;
};

/**
 * Repository constants
 */
export const REPO_CONFIG = {
  owner: 'tgilabs',
  name: 'wikipedia',
  branch: 'Production',
  allowedPath: 'docs/community',
} as const;
