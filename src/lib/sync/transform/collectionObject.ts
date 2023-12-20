import { setIfHasValue, getLegacyId } from './utils';
import type { JsonData, ElasticsearchDocument, ElasticsearchTransformFunction } from '@/types';

const transform: ElasticsearchTransformFunction = (
  sanityDoc: JsonData,
  websiteUrl: string,
): ElasticsearchDocument => {
  const esDoc: ElasticsearchDocument = {
    _id: sanityDoc._id,
    type: 'collectionObject',
    rawSource: sanityDoc,
    language: 'en-US',
  };

  const id = getLegacyId(sanityDoc._id);
  const url = `${websiteUrl}/opencollection/objects/${id}`;

  const imageUrl = getImageUrl(sanityDoc.images);

  setIfHasValue(esDoc, 'url', url);
  setIfHasValue(esDoc, 'title', sanityDoc.title?.trim());
  setIfHasValue(esDoc, 'description', sanityDoc.description?.trim());
  setIfHasValue(esDoc, 'imageUrl', imageUrl);
  // for collectionObjects we don't set startDate & endDate due to
  // possible range beyond unix epoch, e.g. -500 (500 BCE)
  setIfHasValue(esDoc, 'startYear', sanityDoc.objectDateBegin);
  setIfHasValue(esDoc, 'endYear', sanityDoc.objectDateEnd);

  esDoc.searchText = sanityDoc.accessionNumber;

  if (sanityDoc.classification && sanityDoc.classification !== '(not assigned)') {
    esDoc.classification = sanityDoc.classification;
  }
  if (sanityDoc.constituents && Array.isArray(sanityDoc.constituents)) {
    // find 'Artist' constituent
    const primaryConstituent = sanityDoc.constituents.find(
      (constituent) => constituent.role && constituent.role.name === 'Artist' && constituent.artist,
    );
    if (primaryConstituent && primaryConstituent.artist?.name) {
      esDoc.primaryConstituent = {
        id: primaryConstituent.artist._id,
        name: primaryConstituent.artist.name,
        role: primaryConstituent.role.name,
      };
    } else {
      // find 'Culture' constituent
      const cultureConstituent = sanityDoc.constituents.find(
        (constituent) => constituent.role && constituent.role.name === 'Culture',
      );
      if (cultureConstituent && cultureConstituent.artist?.name) {
        esDoc.primaryConstituent = {
          id: cultureConstituent.artist._id,
          name: cultureConstituent.artist.name,
          role: cultureConstituent.role.name,
        };
      }
    }
  }
  return esDoc;
};

function getImageUrl(images: any[]) {
  if (images && Array.isArray(images) && images.length > 0) {
    // sometimes there's a rank 0 image, sometimes not
    let image = images.find((image) => image.rank === 0);
    if (!image || !image.filename) {
      image = images.find((image) => image.rank === 1);
    }
    if (image && image.filename) {
      return `https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size0/${image.filename}`;
    }
  }
  return '';
}

export default transform;
