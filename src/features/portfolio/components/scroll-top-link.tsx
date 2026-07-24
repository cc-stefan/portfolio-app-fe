'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { clearHashFromUrl, normalizeSectionPathname, scrollPageToTop } from '../lib/section-scroll';

type ScrollTopLinkProps = React.ComponentProps<typeof Link>;

export const ScrollTopLink = React.forwardRef<HTMLAnchorElement, ScrollTopLinkProps>(
  function ScrollTopLink({ href, onClick, ...props }, ref) {
    const pathname = usePathname();

    function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
      onClick?.(event);

      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        props.target === '_blank' ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const hrefValue = typeof href === 'string' ? href : href.toString();

      if (normalizeSectionPathname(hrefValue) !== normalizeSectionPathname(pathname)) {
        return;
      }

      event.preventDefault();
      clearHashFromUrl();
      scrollPageToTop();
    }

    return <Link ref={ref} href={href} onClick={handleClick} {...props} />;
  }
);
