"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import {
  clearHashFromUrl,
  normalizeSectionPathname,
  parseSectionHref,
  scrollToSection,
  setPendingSectionScrollTarget,
} from "../lib/section-scroll";

type SectionScrollLinkProps = React.ComponentProps<typeof Link>;

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

    const hrefValue = typeof href === "string" ? href : href.toString();
    const sectionTarget = parseSectionHref(hrefValue, pathname);

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

  return <Link ref={ref} href={href} onClick={handleClick} {...props} />;
});
