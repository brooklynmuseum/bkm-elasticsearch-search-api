import type { SanityRoute, SanitySlug } from '@/types';

export function transformPageRoute(
  route: SanityRoute,
  slug: SanitySlug,
  locale: string,
  baseUrl: string = '',
): string {
  let pathSegment = '';
  if (Array.isArray(route.path)) {
    pathSegment = route.path.find((p) => p._key === locale)?.value ?? '';

    // Fallback to 'en-US' if the locale is not found
    if (!pathSegment && locale !== 'en-US') {
      pathSegment = route.path.find((p) => p._key === 'en-US')?.value ?? '';
    }
  }

  const currentUrl = baseUrl + (pathSegment ? '/' + pathSegment : '');

  // Append the slug at the end of the current URL level
  const finalUrl = slug.current ? currentUrl + '/' + slug.current : currentUrl;

  // Process subroutes if they exist
  if (route.subroutes) {
    return route.subroutes.reduce((url, subroute) => {
      return transformPageRoute(subroute, slug, locale, url);
    }, finalUrl);
  }

  return finalUrl;
}
