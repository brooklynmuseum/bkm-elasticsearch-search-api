import { setIfHasValue, getLegacyId, getBooleanValue } from './utils';
import type { JsonData, ElasticsearchDocument, ElasticsearchTransformFunction } from '@/types';
import { museumLocations } from './dictionaries/museumLocations';
import { collections } from './dictionaries/collections';

const transform: ElasticsearchTransformFunction = (
  sanityDoc: JsonData,
  websiteUrl: string,
): ElasticsearchDocument => {
  const esDoc: ElasticsearchDocument = {
    _id: sanityDoc._id,
    type: 'collectionObject',
    rawSource: sanityDoc,
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
  if (esDoc.startYear && esDoc.startYear > 0 && esDoc.endYear === 0) {
    // TODO: Bug in TMS/Sanity data: objectDateEnd is sometimes 0
    // even though objectDateBegin is set.  In this case, set endYear
    // to startYear.
    esDoc.endYear = esDoc.startYear;
  }

  setIfHasValue(esDoc, 'collection', getCollectionName(sanityDoc.collectionId));
  setIfHasValue(esDoc, 'museumLocation', getMuseumLocationDescription(sanityDoc.museumLocationId));
  esDoc.visible = getBooleanValue(sanityDoc.visible);
  esDoc.publicAccess = getBooleanValue(sanityDoc.publicAccess);

  esDoc.searchText = sanityDoc.accessionNumber;

  if (sanityDoc.classification && sanityDoc.classification !== '(not assigned)') {
    esDoc.classification = sanityDoc.classification;
  }

  if (Array.isArray(sanityDoc.constituents) && sanityDoc.constituents.length > 0) {
    esDoc.constituents = sanityDoc.constituents.map((constituent) => {
      return {
        id: getLegacyId(constituent.artist._id),
        ...(constituent.artist.name && { name: constituent.artist.name }),
        ...(constituent.artist.dates && { dates: constituent.artist.dates }),
        ...(constituent.artist.startYear && { startYear: constituent.artist.startYear }),
        ...(constituent.artist.endYear && { endYear: constituent.artist.endYear }),
        ...(constituent.nationality && { nationality: constituent.artist.nationality }),
        ...(constituent.role?.name && { role: constituent.role.name }),
      };
    });
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

function getMuseumLocationDescription(locationId: number) {
  const museumLocation = museumLocations.find((museumLocation) => museumLocation.id === locationId);
  return museumLocation ? museumLocation.description : null;
}

function getCollectionName(collectionId: number) {
  const collection = collections.find((collection) => collection.id === collectionId);
  return collection ? collection.name : null;
}

export default transform;
