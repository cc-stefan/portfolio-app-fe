import type { MetadataRoute } from 'next';
import { getAbsoluteUrl, getSiteOrigin } from '@/features/seo/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/ro/admin', '/api/'],
    },
    sitemap: getAbsoluteUrl('/sitemap.xml'),
    host: getSiteOrigin(),
  };
}
