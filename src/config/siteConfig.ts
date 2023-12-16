import type { SiteConfig } from '@/types';

/**
 * The site configuration.  Defines all ingesters, RSS feeds, and nav items.
 */
export const siteConfig: SiteConfig = {
  types: [
    {
      name: 'collectionObject',
      basePath: '/collection/object/',
    },
    {
      name: 'collectionArtist',
      basePath: '/collection/artist/',
    },
    {
      name: 'exhibition',
      basePath: '/exhibition/',
    },
    {
      name: 'page',
      basePath: '/page/',
    },
    {
      name: 'product',
      basePath: '/product/',
    },
  ],
};
