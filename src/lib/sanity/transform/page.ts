import { JsonData } from '@/types';
import { setIfHasValue, portableTextToPlaintext } from '@/lib/utils';
import { transformPageRoute } from './pageRoute';

export default function transformPage(page: JsonData, websiteUrl: string): JsonData | undefined {
  const esDoc: JsonData = {
    _id: page._id,
    type: 'page',
    rawSource: page,
  };

  const path = transformPageRoute(page.route, page.language, '', page.slug);
  if (!path) return; // don't index unrouted pages
  const url = `${websiteUrl}${path}`;

  setIfHasValue(esDoc, 'url', url);
  setIfHasValue(esDoc, 'title', page.title?.trim());
  setIfHasValue(esDoc, 'searchText', portableTextToPlaintext(page.content));
  setIfHasValue(esDoc, 'language', page.language);
  return esDoc;
}
