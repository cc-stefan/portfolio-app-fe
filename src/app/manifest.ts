import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Claudiu Stefan - Frontend Engineer',
    short_name: 'Claudiu Stefan',
    description:
      'Frontend engineering portfolio focused on scalable interfaces, maintainable architecture, and product clarity.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#0f8f87',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
