import { JsonData } from '@/types';
import { setIfHasValue, portableTextToPlaintext } from '@/lib/utils';
import { getLegacyId } from '@/lib/utils';

export default function transformExhibition(exhibition: JsonData, websiteUrl: string): JsonData {
  const esDoc: JsonData = {
    _id: exhibition._id,
    type: 'exhibition',
    rawSource: exhibition,
  };

  const slug = exhibition.slug?.current?.trim();
  const exhibitionUrl = `${websiteUrl}/exhibitions/${slug}`;

  setIfHasValue(esDoc, 'url', exhibitionUrl);
  setIfHasValue(esDoc, 'title', exhibition.title?.trim());
  setIfHasValue(esDoc, 'description', portableTextToPlaintext(exhibition.description));
  setIfHasValue(esDoc, 'startDate', exhibition.startsAt);
  setIfHasValue(esDoc, 'endDate', exhibition.endsAt);
  setIfHasValue(esDoc, 'language', exhibition.language);
  return esDoc;
}
