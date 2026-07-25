const auditBaseUrl = new URL(process.env.SEO_BASE_URL ?? 'http://127.0.0.1:3000');
const localAuditOrigin =
  ['127.0.0.1', '::1'].includes(auditBaseUrl.hostname) && !process.env.SEO_PUBLIC_ORIGIN
    ? `${auditBaseUrl.protocol}//localhost${auditBaseUrl.port ? `:${auditBaseUrl.port}` : ''}`
    : auditBaseUrl.origin;
const expectedPublicOrigin = new URL(
  process.env.SEO_PUBLIC_ORIGIN ?? process.env.NEXT_PUBLIC_SITE_URL ?? localAuditOrigin
).origin;
const crawlerHeaders = {
  'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
};
const failures = [];

function fail(message) {
  failures.push(message);
}

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function getTags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map(([tag]) => tag);
}

function getAttribute(tag, attribute) {
  const match = tag.match(new RegExp(`\\b${attribute}=(?:\"([^\"]*)\"|'([^']*)')`, 'i'));
  return match ? decodeHtml(match[1] ?? match[2] ?? '') : null;
}

function getMetaContent(html, selectorAttribute, selectorValue) {
  return getTags(html, 'meta')
    .filter((tag) => getAttribute(tag, selectorAttribute) === selectorValue)
    .map((tag) => getAttribute(tag, 'content'))
    .filter(Boolean);
}

function getLinkHrefs(html, rel) {
  return getTags(html, 'link')
    .filter((tag) => getAttribute(tag, 'rel')?.split(/\s+/).includes(rel))
    .map((tag) => ({
      href: getAttribute(tag, 'href'),
      hreflang: getAttribute(tag, 'hreflang'),
    }))
    .filter((entry) => entry.href);
}

function getAnchorHrefs(html) {
  return getTags(html, 'a')
    .map((tag) => getAttribute(tag, 'href'))
    .filter(Boolean);
}

function parseJsonLd(html, route) {
  const scripts = [
    ...html.matchAll(
      /<script\b[^>]*type=(?:\"application\/ld\+json\"|'application\/ld\+json')[^>]*>([\s\S]*?)<\/script>/gi
    ),
  ];

  if (scripts.length === 0) {
    fail(`${route}: missing JSON-LD`);
    return;
  }

  for (const [, source] of scripts) {
    try {
      const data = JSON.parse(source);

      if (data['@context'] !== 'https://schema.org' || !Array.isArray(data['@graph'])) {
        fail(`${route}: JSON-LD must contain a Schema.org @context and @graph`);
      }
    } catch (error) {
      fail(`${route}: invalid JSON-LD (${error instanceof Error ? error.message : String(error)})`);
    }
  }
}

async function fetchRoute(pathname, init = {}) {
  const url = new URL(pathname, auditBaseUrl);
  return fetch(url, {
    redirect: 'follow',
    headers: crawlerHeaders,
    ...init,
  });
}

async function auditIndexablePage(pathname, expectedLanguage) {
  const response = await fetchRoute(pathname);
  const html = await response.text();

  if (response.status !== 200) {
    fail(`${pathname}: expected 200, received ${response.status}`);
    return { anchors: [], canonical: null };
  }

  const titles = [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)].map((match) =>
    decodeHtml(match[1].trim())
  );
  const descriptions = getMetaContent(html, 'name', 'description');
  const canonicals = getLinkHrefs(html, 'canonical');
  const robots = getMetaContent(html, 'name', 'robots').join(',');
  const openGraphTitle = getMetaContent(html, 'property', 'og:title');
  const openGraphDescription = getMetaContent(html, 'property', 'og:description');
  const openGraphUrl = getMetaContent(html, 'property', 'og:url');
  const openGraphImage = getMetaContent(html, 'property', 'og:image');
  const twitterCard = getMetaContent(html, 'name', 'twitter:card');
  const languageAlternates = getLinkHrefs(html, 'alternate').filter((entry) => entry.hreflang);
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? '';
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;

  if (titles.length !== 1 || !titles[0]) {
    fail(`${pathname}: expected one non-empty title`);
  }

  if (descriptions.length !== 1 || !descriptions[0]) {
    fail(`${pathname}: expected one non-empty meta description`);
  }

  if (canonicals.length !== 1) {
    fail(`${pathname}: expected exactly one canonical URL`);
  }

  const canonical = canonicals[0]?.href ?? null;

  if (canonical) {
    const canonicalUrl = new URL(canonical);

    if (canonicalUrl.origin !== expectedPublicOrigin) {
      fail(
        `${pathname}: canonical origin ${canonicalUrl.origin} does not match ${expectedPublicOrigin}`
      );
    }

    if (canonicalUrl.search || canonicalUrl.hash) {
      fail(`${pathname}: canonical must not contain a query string or fragment`);
    }
  }

  if (robots.includes('noindex')) {
    fail(`${pathname}: public sitemap page is noindex`);
  }

  if (getAttribute(htmlTag, 'lang') !== expectedLanguage) {
    fail(`${pathname}: expected html lang=${expectedLanguage}`);
  }

  if (h1Count !== 1) {
    fail(`${pathname}: expected exactly one h1, found ${h1Count}`);
  }

  if (
    openGraphTitle.length !== 1 ||
    openGraphDescription.length !== 1 ||
    openGraphUrl.length !== 1
  ) {
    fail(`${pathname}: incomplete Open Graph title, description, or URL`);
  }

  if (openGraphImage.length !== 1 || !/^https?:\/\//.test(openGraphImage[0])) {
    fail(`${pathname}: expected one absolute Open Graph image URL`);
  }

  if (twitterCard.length !== 1) {
    fail(`${pathname}: missing Twitter card metadata`);
  }

  const expectedLanguageTag = expectedLanguage === 'ro' ? 'ro-RO' : 'en-US';

  if (!languageAlternates.some((entry) => entry.hreflang === expectedLanguageTag)) {
    fail(`${pathname}: missing self-referencing ${expectedLanguageTag} hreflang`);
  }

  if (
    languageAlternates.some((entry) => entry.hreflang === 'en-US') &&
    !languageAlternates.some((entry) => entry.hreflang === 'x-default')
  ) {
    fail(`${pathname}: missing x-default hreflang`);
  }

  parseJsonLd(html, pathname);

  return {
    anchors: getAnchorHrefs(html),
    canonical,
    title: titles[0] ?? null,
  };
}

const robotsResponse = await fetchRoute('/robots.txt');
const robotsText = await robotsResponse.text();

if (robotsResponse.status !== 200 || !robotsText.includes('Disallow: /admin')) {
  fail('/robots.txt: missing or does not block admin routes');
}

if (!robotsText.includes(`${expectedPublicOrigin}/sitemap.xml`)) {
  fail('/robots.txt: sitemap URL does not use the expected public origin');
}

const sitemapResponse = await fetchRoute('/sitemap.xml');
const sitemapXml = await sitemapResponse.text();
const sitemapLocations = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
  decodeHtml(match[1])
);

if (
  sitemapResponse.status !== 200 ||
  !sitemapXml.includes('<urlset') ||
  sitemapLocations.length === 0
) {
  fail('/sitemap.xml: missing or invalid URL set');
}

if (new Set(sitemapLocations).size !== sitemapLocations.length) {
  fail('/sitemap.xml: contains duplicate URL entries');
}

for (const location of sitemapLocations) {
  const url = new URL(location);

  if (url.origin !== expectedPublicOrigin || url.search || url.hash) {
    fail(`/sitemap.xml: invalid canonical location ${location}`);
  }

  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/ro/admin')) {
    fail(`/sitemap.xml: admin URL must not be included (${location})`);
  }
}

const manifestResponse = await fetchRoute('/manifest.webmanifest');
const manifest = await manifestResponse.json().catch(() => null);

if (
  manifestResponse.status !== 200 ||
  !manifest?.name ||
  manifest?.start_url !== '/' ||
  !Array.isArray(manifest?.icons) ||
  manifest.icons.length === 0
) {
  fail('/manifest.webmanifest: missing or incomplete manifest');
}

const auditResults = new Map();

for (const location of sitemapLocations) {
  const url = new URL(location);
  const pathname = `${url.pathname}${url.search}`;
  const expectedLanguage = url.pathname === '/ro' || url.pathname.startsWith('/ro/') ? 'ro' : 'en';
  auditResults.set(pathname, await auditIndexablePage(pathname, expectedLanguage));
}

const titleRoutes = new Map();

for (const [pathname, result] of auditResults) {
  if (!result.title) {
    continue;
  }

  const existingRoute = titleRoutes.get(result.title);

  if (existingRoute) {
    fail(`duplicate title "${result.title}" on ${existingRoute} and ${pathname}`);
  } else {
    titleRoutes.set(result.title, pathname);
  }
}

for (const [pathname, result] of auditResults) {
  if (pathname !== '/' && pathname !== '/ro') {
    continue;
  }

  const languagePrefix = pathname === '/ro' ? '/ro' : '';
  const projectLocations = sitemapLocations.filter((location) => {
    const projectUrl = new URL(location);
    return languagePrefix
      ? projectUrl.pathname.startsWith('/ro/projects/')
      : projectUrl.pathname.startsWith('/projects/');
  });
  const anchors = new Set(result.anchors.map((href) => new URL(href, auditBaseUrl).pathname));

  for (const projectLocation of projectLocations) {
    const projectPathname = new URL(projectLocation).pathname;

    if (!anchors.has(projectPathname)) {
      fail(`${pathname}: project ${projectPathname} is not reachable through an HTML link`);
    }
  }
}

const adminResponse = await fetchRoute('/admin/login');
const adminHtml = await adminResponse.text();
const adminRobots = getMetaContent(adminHtml, 'name', 'robots').join(',');

if (adminResponse.status !== 200 || !adminRobots.includes('noindex')) {
  fail('/admin/login: expected a 200 page with noindex metadata');
}

const missingResponse = await fetchRoute('/seo-check-missing-route');
const missingHtml = await missingResponse.text();
const missingRobots = getMetaContent(missingHtml, 'name', 'robots').join(',');

if (missingResponse.status !== 404 || !missingRobots.includes('noindex')) {
  fail('404 route: expected HTTP 404 with noindex metadata');
}

const missingProjectResponse = await fetchRoute('/projects/__seo-check-missing-project__');
const missingProjectHtml = await missingProjectResponse.text();
const missingProjectRobots = getMetaContent(missingProjectHtml, 'name', 'robots').join(',');

if (missingProjectResponse.status !== 404 || !missingProjectRobots.includes('noindex')) {
  fail('Missing project route: expected HTTP 404 with noindex metadata');
}

const checkedInternalUrls = new Set();

for (const result of auditResults.values()) {
  for (const href of result.anchors) {
    const url = new URL(href, auditBaseUrl);

    if (
      url.origin !== auditBaseUrl.origin ||
      url.pathname.startsWith('/admin') ||
      url.pathname.startsWith('/ro/admin') ||
      url.pathname.startsWith('/_next')
    ) {
      continue;
    }

    url.hash = '';
    url.search = '';
    checkedInternalUrls.add(url.pathname);
  }
}

for (const pathname of checkedInternalUrls) {
  const response = await fetchRoute(pathname);

  if (response.status >= 400) {
    fail(`internal link ${pathname}: received ${response.status}`);
  }
}

if (failures.length > 0) {
  console.error(`SEO check failed with ${failures.length} issue(s):`);

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exitCode = 1;
} else {
  console.log(
    `SEO check passed: ${sitemapLocations.length} sitemap URLs and ${checkedInternalUrls.size} internal URLs validated.`
  );
}
