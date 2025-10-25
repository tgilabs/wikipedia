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
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      const trimmedKey = key.trim();
      
      if (trimmedKey === 'title') {
        metadata[trimmedKey] = value.replace(/['"]/g, '');
      } else if (trimmedKey === 'sidebar_position') {
        metadata[trimmedKey] = parseInt(value, 10);
      } else {
        metadata[trimmedKey] = value;
      }
    }
  });

  return { metadata, body };
};

/**
 * Build frontmatter string from metadata object
 */
export const buildFrontmatter = (metadata: Record<string, any>): string => {
  const keys = Object.keys(metadata);
  if (keys.length === 0) return '';

  let frontmatter = '---\n';
  
  if (metadata.title) {
    frontmatter += `title: "${metadata.title}"\n`;
  }
  
  if (metadata.sidebar_position !== undefined) {
    frontmatter += `sidebar_position: ${metadata.sidebar_position}\n`;
  }
  
  // Add any other metadata fields
  keys.forEach(key => {
    if (key !== 'title' && key !== 'sidebar_position') {
      frontmatter += `${key}: ${metadata[key]}\n`;
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
