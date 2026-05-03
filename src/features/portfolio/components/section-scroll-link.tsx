"use client";

import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import {
  clearHashFromUrl,
  normalizeSectionPathname,
  parseSectionHref,
  scrollToSection,
  setPendingSectionScrollTarget,
} from "../lib/section-scroll";

interface SectionScrollLinkProps extends React.ComponentProps<"a"> {
  href: string;
}

export const SectionScrollLink = React.forwardRef<
  HTMLAnchorElement,
  SectionScrollLinkProps
>(function SectionScrollLink({ href, onClick, ...props }, ref) {
  const pathname = usePathname();
  const router = useRouter();

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      props.target === "_blank" ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const sectionTarget = parseSectionHref(href, pathname);

    if (!sectionTarget) {
      return;
    }

    event.preventDefault();
    clearHashFromUrl();

    if (sectionTarget.pathname === normalizeSectionPathname(pathname)) {
      scrollToSection(sectionTarget.id);
      return;
    }

    setPendingSectionScrollTarget(sectionTarget);
    router.push(sectionTarget.pathname);
  }

  return <a ref={ref} href={href} onClick={handleClick} {...props} />;
});
