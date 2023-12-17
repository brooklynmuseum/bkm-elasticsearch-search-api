import { setIfHasValue, portableTextToPlaintext } from '@/lib/utils';
import type { JsonData, ElasticsearchDocument, ElasticsearchTransformFunction } from '@/types';

const transform: ElasticsearchTransformFunction = (
  sanityDoc: JsonData,
  websiteUrl: string,
): ElasticsearchDocument => {
  const esDoc: ElasticsearchDocument = {
    _id: sanityDoc._id,
    type: 'exhibition',
    rawSource: sanityDoc,
  };

  const slug = sanityDoc.slug?.current?.trim();
  const url = `${websiteUrl}/exhibitions/${slug}`;
  const imageUrl = sanityDoc.coverImage?.asset?.url;

  setIfHasValue(esDoc, 'url', url);
  setIfHasValue(esDoc, 'title', sanityDoc.title?.trim());
  setIfHasValue(esDoc, 'description', portableTextToPlaintext(sanityDoc.description));
  setIfHasValue(esDoc, 'imageUrl', imageUrl);
  setIfHasValue(esDoc, 'startDate', sanityDoc.startsAt);
  setIfHasValue(esDoc, 'endDate', sanityDoc.endsAt);
  setIfHasValue(esDoc, 'language', sanityDoc.language);
  return esDoc;
};

export default transform;
