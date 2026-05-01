const PENDING_SECTION_SCROLL_STORAGE_KEY = "portfolio-pending-section-scroll";

interface PendingSectionScrollTarget {
  id: string;
  pathname: string;
}

export function normalizeSectionPathname(pathname: string) {
  const [pathWithoutHash] = pathname.split("#");
  const [pathWithoutSearch] = (pathWithoutHash || "/").split("?");
  const normalizedPath = pathWithoutSearch || "/";

  if (normalizedPath === "/") {
    return normalizedPath;
  }

  return normalizedPath.replace(/\/+$/, "");
}

export function parseSectionHref(
  href: string,
  currentPathname: string,
): PendingSectionScrollTarget | null {
  if (!href.includes("#")) {
    return null;
  }

  const [rawPathname, rawId] = href.split("#");
  const id = rawId?.trim();

  if (!id) {
    return null;
  }

  const pathname = rawPathname
    ? normalizeSectionPathname(rawPathname)
    : normalizeSectionPathname(currentPathname);

  return {
    id,
    pathname,
  };
}

export function setPendingSectionScrollTarget(
  target: PendingSectionScrollTarget,
) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    PENDING_SECTION_SCROLL_STORAGE_KEY,
    JSON.stringify(target),
  );
}

export function getPendingSectionScrollTarget() {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.sessionStorage.getItem(
    PENDING_SECTION_SCROLL_STORAGE_KEY,
  );

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as PendingSectionScrollTarget;
  } catch {
    window.sessionStorage.removeItem(PENDING_SECTION_SCROLL_STORAGE_KEY);
    return null;
  }
}

export function clearPendingSectionScrollTarget() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(PENDING_SECTION_SCROLL_STORAGE_KEY);
}

export function clearHashFromUrl() {
  if (typeof window === "undefined" || !window.location.hash) {
    return;
  }

  const nextUrl = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(window.history.state, "", nextUrl);
}

export function scrollToSection(id: string) {
  if (typeof window === "undefined") {
    return false;
  }

  const element = window.document.getElementById(id);

  if (!element) {
    return false;
  }

  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  return true;
}
