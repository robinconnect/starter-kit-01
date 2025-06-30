import { getLinkAttributes } from './link-helper';

/**
 * Processes HTML content to automatically add appropriate target and rel attributes to links
 * @param html - The HTML content to process
 * @returns Processed HTML with smart link attributes
 */
export function processLinksInHTML(html: string): string {
  if (typeof window === 'undefined') {
    // Server-side: use basic regex processing
    return html.replace(/<a\s+([^>]*?)href=(["'])(.*?)\2([^>]*?)>/gi, (match, beforeHref, quote, url, afterHref) => {
      const linkAttrs = getLinkAttributes(url);
      
      // Remove existing target and rel attributes
      let cleanBeforeHref = beforeHref.replace(/\s*(target|rel)=["'][^"']*["']/gi, '');
      let cleanAfterHref = afterHref.replace(/\s*(target|rel)=["'][^"']*["']/gi, '');
      
      // Add new attributes if needed
      let additionalAttrs = '';
      if (linkAttrs.target) {
        additionalAttrs += ` target="${linkAttrs.target}"`;
      }
      if (linkAttrs.rel) {
        additionalAttrs += ` rel="${linkAttrs.rel}"`;
      }
      
      return `<a ${cleanBeforeHref.trim()} href=${quote}${url}${quote}${cleanAfterHref}${additionalAttrs}>`;
    });
  } else {
    // Client-side: use DOM manipulation for more reliable processing
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const links = tempDiv.querySelectorAll('a[href]');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href) {
        const linkAttrs = getLinkAttributes(href);
        
        // Remove existing attributes
        link.removeAttribute('target');
        link.removeAttribute('rel');
        
        // Add new attributes if needed
        if (linkAttrs.target) {
          link.setAttribute('target', linkAttrs.target);
        }
        if (linkAttrs.rel) {
          link.setAttribute('rel', linkAttrs.rel);
        }
      }
    });
    
    return tempDiv.innerHTML;
  }
}
