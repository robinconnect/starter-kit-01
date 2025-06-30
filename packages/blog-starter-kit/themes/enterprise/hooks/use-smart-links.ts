import { useEffect } from 'react';
import { isInternalLink } from '../utils/link-helper';

/**
 * React hook that automatically handles link clicks in the document
 * Internal links stay in the same tab, external links open in new tab
 */
export function useSmartLinks() {
  useEffect(() => {
    const handleLinkClick = (event: Event) => {
      const target = event.target as HTMLElement;
      
      // Find the closest anchor tag
      const link = target.closest('a[href]') as HTMLAnchorElement;
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href) return;
      
      // Skip if link already has target="_blank" or is a Next.js Link
      if (link.hasAttribute('data-next-link') || link.target === '_blank') {
        return;
      }
      
      // Handle external links
      if (!isInternalLink(href)) {
        event.preventDefault();
        window.open(href, '_blank', 'noopener,noreferrer');
      }
      // Internal links will be handled normally (same tab)
    };
    
    // Add event listener to the document
    document.addEventListener('click', handleLinkClick);
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);
}

/**
 * Processes all existing links in the document to add appropriate attributes
 * Useful for content that's already rendered
 */
export function processExistingLinks() {
  useEffect(() => {
    const links = document.querySelectorAll('a[href]');
    
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      
      // Skip if it's a Next.js Link or already processed
      if (link.hasAttribute('data-next-link') || link.hasAttribute('data-smart-link-processed')) {
        return;
      }
      
      if (!isInternalLink(href)) {
        // External link
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
      
      // Mark as processed
      link.setAttribute('data-smart-link-processed', 'true');
    });
  }, []);
}
