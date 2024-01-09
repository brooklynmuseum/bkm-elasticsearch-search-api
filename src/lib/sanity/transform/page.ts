import { portableTextToPlaintext, SANITY_SOURCE } from './utils';
import { setIfHasValue } from '@/lib/utils';
import { transformPageRoute } from './pageRoute';
import type { JsonData, ElasticsearchDocument, ElasticsearchTransformFunction } from '@/types';

const transform: ElasticsearchTransformFunction = (
  sanityDoc: JsonData,
  websiteUrl: string,
): ElasticsearchDocument | undefined => {
  const esDoc: ElasticsearchDocument = {
    _id: sanityDoc._id,
    source: SANITY_SOURCE,
    type: 'page',
    rawSource: sanityDoc,
  };

  const path = transformPageRoute(sanityDoc.route, sanityDoc.language, '', sanityDoc.slug);
  if (!path) return; // don't index unrouted pages
  const url = `${websiteUrl}${path}`;
  const imageUrl = sanityDoc.coverImage?.asset?.url;

  setIfHasValue(esDoc, 'url', url);
  setIfHasValue(esDoc, 'title', sanityDoc.title?.trim());
  setIfHasValue(esDoc, 'imageUrl', imageUrl);
  setIfHasValue(esDoc, 'searchText', portableTextToPlaintext(sanityDoc.content));
  setIfHasValue(esDoc, 'language', sanityDoc.language);
  return esDoc;
};

export default transform;
