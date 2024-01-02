import {
  setIfHasValue,
  portableTextToPlaintext,
  recursivePortableTextToPlaintext,
  setDateAndYear,
} from './utils';
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
  setIfHasValue(esDoc, 'searchText', recursivePortableTextToPlaintext(sanityDoc.content));
  setIfHasValue(esDoc, 'imageUrl', imageUrl);
  setDateAndYear(esDoc, sanityDoc.startsAt, 'start');
  setDateAndYear(esDoc, sanityDoc.endsAt, 'end');
  setIfHasValue(esDoc, 'language', sanityDoc.language);
  return esDoc;
};

export default transform;
