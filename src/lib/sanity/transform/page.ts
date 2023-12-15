import { JsonData } from '@/types';
import { setIfHasValue, portableTextToPlaintext } from '../../various';

export default function transformPage(page: JsonData): JsonData {
  const esDoc: JsonData = {
    _id: page._id,
    rawSource: page,
  };
  setIfHasValue(esDoc, 'title', page.title);
  setIfHasValue(esDoc, 'searchText', portableTextToPlaintext(page.content));
  setIfHasValue(esDoc, 'language', page.language);
  return esDoc;
}
