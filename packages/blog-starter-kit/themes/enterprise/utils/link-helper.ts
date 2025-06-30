/**
 * Determines if a URL is internal (same domain) or external
 * @param url - The URL to check
 * @returns true if the URL is internal, false if external
 */
export function isInternalLink(url: string): boolean {
  if (!url) return false;
  
  // Handle relative URLs (internal)
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
    return true;
  }
  
  // Handle absolute URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const urlObj = new URL(url);
      const currentHost = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'robinconnect.hashnode.dev';
      const customDomain = 'robinconnect.com';
      
      // Check if it's your domain or subdomain
      return urlObj.hostname === currentHost || 
             urlObj.hostname === customDomain ||
             urlObj.hostname.endsWith(`.${customDomain}`) ||
             urlObj.hostname === 'localhost' ||
             urlObj.hostname.startsWith('127.0.0.1');
    } catch {
      return false;
    }
  }
  
  // Handle protocol-relative URLs
  if (url.startsWith('//')) {
    return isInternalLink(`https:${url}`);
  }
  
  // Default to internal for relative paths
  return true;
}

/**
 * Gets the appropriate target and rel attributes for a link
 * @param url - The URL to get attributes for
 * @returns Object with target and rel properties
 */
export function getLinkAttributes(url: string): {
  target?: string;
  rel?: string;
} {
  if (isInternalLink(url)) {
    // Internal links: open in same tab
    return {};
  } else {
    // External links: open in new tab with security attributes
    return {
      target: '_blank',
      rel: 'noopener noreferrer'
    };
  }
}

/**
 * Creates a complete set of link props including href and appropriate target/rel
 * @param url - The URL for the link
 * @returns Object with href, target, and rel properties
 */
export function createLinkProps(url: string) {
  return {
    href: url,
    ...getLinkAttributes(url)
  };
}
