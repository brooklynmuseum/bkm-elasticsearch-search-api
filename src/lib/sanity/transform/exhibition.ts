import { JsonData } from '@/types';
import { setIfHasValue, portableTextToPlaintext } from '../../various';

export default function transformExhibition(exhibition: JsonData): JsonData {
  const esDoc: JsonData = {
    _id: exhibition._id,
    type: 'exhibition',
    rawSource: exhibition,
  };
  setIfHasValue(esDoc, 'title', exhibition.title);
  setIfHasValue(esDoc, 'description', portableTextToPlaintext(exhibition.description));
  setIfHasValue(esDoc, 'startDate', exhibition.startsAt);
  setIfHasValue(esDoc, 'endDate', exhibition.endsAt);
  setIfHasValue(esDoc, 'language', exhibition.language);
  return esDoc;
}
