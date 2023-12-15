import { JsonData } from '@/types';
import { setIfHasValue, portableTextToPlaintext } from '@/lib/utils';
import { transformPageRoute } from './pageRoute';

export default function transformPage(page: JsonData): JsonData | undefined {
  const esDoc: JsonData = {
    _id: page._id,
    type: 'page',
    rawSource: page,
  };
  const url = transformPageRoute(page.route, page.language, '', page.slug);
  if (!url) return; // don't index unrouted pages
  setIfHasValue(esDoc, 'url', url);
  setIfHasValue(esDoc, 'title', page.title?.trim());
  setIfHasValue(esDoc, 'searchText', portableTextToPlaintext(page.content));
  setIfHasValue(esDoc, 'language', page.language);
  return esDoc;
}
