'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  clearHashFromUrl,
  clearPendingSectionScrollTarget,
  getPendingSectionScrollTarget,
  normalizeSectionPathname,
  scrollToSection,
} from '../lib/section-scroll';

export function SectionScrollRestorer() {
  const pathname = usePathname();

  useEffect(() => {
    const normalizedPathname = normalizeSectionPathname(pathname);
    const pendingTarget = getPendingSectionScrollTarget();

    if (pendingTarget?.pathname === normalizedPathname) {
      const timeoutId = window.setTimeout(() => {
        const didScroll = scrollToSection(pendingTarget.id);

        if (didScroll) {
          clearHashFromUrl();
        }

        clearPendingSectionScrollTarget();
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    if (!window.location.hash) {
      return;
    }

    const id = window.location.hash.slice(1);

    if (!id) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const didScroll = scrollToSection(id);

      if (didScroll) {
        clearHashFromUrl();
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
