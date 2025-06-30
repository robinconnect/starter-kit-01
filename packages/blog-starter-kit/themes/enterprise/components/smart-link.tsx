import Link from 'next/link';
import { AnchorHTMLAttributes, ReactNode } from 'react';
import { createLinkProps, isInternalLink } from '../utils/link-helper';

interface SmartLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  children: ReactNode;
  className?: string;
}

/**
 * Smart Link component that automatically handles internal vs external links
 * - Internal links: Uses Next.js Link for client-side navigation (same tab)
 * - External links: Uses regular anchor tag with target="_blank" and security attributes
 */
export function SmartLink({ href, children, className, ...props }: SmartLinkProps) {
  const linkProps = createLinkProps(href);
  
  if (isInternalLink(href)) {
    // Internal link: use Next.js Link for client-side navigation
    return (
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    );
  } else {
    // External link: use regular anchor with target="_blank"
    return (
      <a 
        {...linkProps}
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  }
}
