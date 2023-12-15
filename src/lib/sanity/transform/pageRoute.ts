import type { SanityRoute, SanitySlug } from '@/types';

export function transformPageRoute(
  route: SanityRoute,
  locale: string,
  baseUrl: string = '',
  slug?: SanitySlug,
): string {
  if (!route) return baseUrl;

  let pathSegment = '';
  if (Array.isArray(route.path)) {
    pathSegment = route.path.find((p) => p._key === locale)?.value ?? '';
    // Fallback to 'en-US' if the locale is not found
    if (!pathSegment && locale !== 'en-US') {
      pathSegment = route.path.find((p) => p._key === 'en-US')?.value ?? '';
    }
  }

  let currentUrl = baseUrl + (pathSegment ? '/' + pathSegment : '');

  if (route.subroutes && route.subroutes.length > 0) {
    currentUrl = route.subroutes.reduce((url, subroute) => {
      return transformPageRoute(subroute, locale, url);
    }, currentUrl);
  }

  if (slug?.current && !route.subroutes) {
    currentUrl += '/' + slug.current;
  }

  return currentUrl;
}
