import { JsonData } from '@/types';
import { setIfHasValue } from '@/lib/utils';
import { getLegacyId } from '@/lib/utils';

export default function transformCollectionObject(
  collectionObject: JsonData,
  websiteUrl: string,
): JsonData {
  const esDoc: JsonData = {
    _id: collectionObject._id,
    type: 'collectionObject',
    rawSource: collectionObject,
    language: 'en-US',
  };

  const objectId = getLegacyId(collectionObject._id);
  const collectionObjectUrl = `${websiteUrl}/opencollection/objects/${objectId}`;

  const imageUrl = getImageUrl(collectionObject.images);

  setIfHasValue(esDoc, 'url', collectionObjectUrl);
  setIfHasValue(esDoc, 'title', collectionObject.title?.trim());
  setIfHasValue(esDoc, 'description', collectionObject.description?.trim());
  setIfHasValue(esDoc, 'imageUrl', imageUrl);
  setIfHasValue(esDoc, 'startYear', collectionObject.objectDateBegin);
  setIfHasValue(esDoc, 'endYear', collectionObject.objectDateEnd);

  esDoc.searchText = collectionObject.accessionNumber;

  if (collectionObject.classification && collectionObject.classification !== '(not assigned)') {
    esDoc.classification = collectionObject.classification;
  }
  if (collectionObject.constituents && Array.isArray(collectionObject.constituents)) {
    // find 'Artist' constituent
    const primaryConstituent = collectionObject.constituents.find(
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
      const cultureConstituent = collectionObject.constituents.find(
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
}

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
