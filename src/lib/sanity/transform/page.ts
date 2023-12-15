import { JsonData } from '@/types';
import { setIfHasValue, portableTextToPlaintext } from '../../various';
import { transformPageRoute } from './pageRoute';

export default function transformPage(page: JsonData): JsonData | undefined {
  const esDoc: JsonData = {
    _id: page._id,
    rawSource: page,
  };
  const url = transformPageRoute(page.route, page.slug, page.language);
  if (!url) return; // don't index unrouted pages
  setIfHasValue(esDoc, 'url', url);
  setIfHasValue(esDoc, 'title', page.title);
  setIfHasValue(esDoc, 'searchText', portableTextToPlaintext(page.content));
  setIfHasValue(esDoc, 'language', page.language);
  return esDoc;
}
