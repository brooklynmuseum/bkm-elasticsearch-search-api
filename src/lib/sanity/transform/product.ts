import { JsonData } from '@/types';
import { setIfHasValue, splitCommaSeparatedString } from '@/lib/utils';

export default function transformProduct(product: JsonData, websiteUrl: string): JsonData {
  const esDoc: JsonData = {
    _id: product._id,
    type: 'product',
    rawSource: product,
    language: 'es-US',
  };
  const store = product.store;
  const slug = store.slug?.current?.trim();
  const url = `https://shop.brooklynmuseum.org/products/${slug}`;

  setIfHasValue(esDoc, 'url', url);
  setIfHasValue(esDoc, 'title', store.title?.trim());
  setIfHasValue(esDoc, 'searchText', store.vendor?.trim());
  setIfHasValue(esDoc, 'keywords', splitCommaSeparatedString(store.tags));
  return esDoc;
}
