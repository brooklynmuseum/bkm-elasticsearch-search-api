import { JsonData } from '@/types';
import { setIfHasValue, splitCommaSeparatedString } from '../../various';

export default function transformProduct(product: JsonData): JsonData {
  const esDoc: JsonData = {
    _id: product._id,
    rawSource: product,
    language: 'es-US',
  };
  const store = product.store;
  setIfHasValue(esDoc, 'title', store.title);
  setIfHasValue(esDoc, 'searchText', store.vendor);
  setIfHasValue(esDoc, 'keywords', splitCommaSeparatedString(store.tags));
  return esDoc;
}
