import { getDictionary } from '@/features/portfolio/i18n/dictionaries';
import { defaultLocale, isAppLocale } from '@/features/portfolio/i18n/routing';
import { createSocialImage, socialImageSize } from '@/features/seo/lib/social-image';

export const alt = 'Claudiu Stefan frontend engineer portfolio';
export const size = socialImageSize;
export const contentType = 'image/png';

export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = isAppLocale(lang) ? lang : defaultLocale;
  const dictionary = await getDictionary(locale);

  return createSocialImage({
    name: dictionary.header.brand,
    role: dictionary.header.tagline,
    description: dictionary.meta.description,
  });
}
