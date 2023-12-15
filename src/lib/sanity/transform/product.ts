import { JsonData } from '@/types';
import { setIfHasValue, splitCommaSeparatedString } from '@/lib/various';

export default function transformProduct(product: JsonData): JsonData {
  const esDoc: JsonData = {
    _id: product._id,
    type: 'product',
    rawSource: product,
    language: 'es-US',
  };
  const store = product.store;
  setIfHasValue(esDoc, 'title', store.title?.trim());
  setIfHasValue(esDoc, 'searchText', store.vendor?.trim());
  setIfHasValue(esDoc, 'keywords', splitCommaSeparatedString(store.tags));
  return esDoc;
}
