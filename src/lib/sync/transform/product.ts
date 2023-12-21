import { setIfHasValue, splitCommaSeparatedString } from './utils';
import type { JsonData, ElasticsearchDocument, ElasticsearchTransformFunction } from '@/types';

const transform: ElasticsearchTransformFunction = (
  sanityDoc: JsonData,
  websiteUrl: string,
): ElasticsearchDocument | undefined => {
  const esDoc: ElasticsearchDocument = {
    _id: sanityDoc._id,
    type: 'product',
    rawSource: sanityDoc,
    language: 'es-US',
  };

  const store = sanityDoc.store;
  if (!store) return; // can't index a product without a store

  const slug = store.slug?.current?.trim();
  const url = `https://shop.brooklynmuseum.org/products/${slug}`;
  const imageUrl = store.previewImageUrl;

  setIfHasValue(esDoc, 'url', url);
  setIfHasValue(esDoc, 'title', store.title?.trim());
  setIfHasValue(esDoc, 'imageUrl', imageUrl);
  setIfHasValue(esDoc, 'searchText', store.vendor?.trim());
  setIfHasValue(esDoc, 'tags', splitCommaSeparatedString(store.tags));
  setIfHasValue(esDoc, 'imageUrl', store.previewImageUrl);
  return esDoc;
};

export default transform;
