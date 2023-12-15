import { JsonData } from '../../../types';
import { setIfHasValue } from '../../various';

export default function transformCollectionObject(collectionObject: JsonData): JsonData {
  const esDoc: JsonData = {
    _id: collectionObject._id,
    rawSource: collectionObject,
  };
  setIfHasValue(esDoc, 'title', collectionObject.title);
  setIfHasValue(esDoc, 'description', collectionObject.description);
  setIfHasValue(esDoc, 'startYear', collectionObject.objectDateStart);
  setIfHasValue(esDoc, 'endYear', collectionObject.objectDateEnd);
  collectionObject.searchText = collectionObject.accessionNumber;
  if (collectionObject.classification && collectionObject.classification !== '(not assigned)') {
    esDoc.classification = collectionObject.classification;
  }
  if (collectionObject.constituents && Array.isArray(collectionObject.constituents)) {
    const primaryConstituent = collectionObject.constituents.find(
      (constituent) => constituent.role && constituent.role.name === 'Artist' && constituent.artist,
    );
    if (primaryConstituent && primaryConstituent.artist.name) {
      esDoc.primaryConstituent = {
        id: primaryConstituent.artist._id,
        name: primaryConstituent.artist.name,
      };
    }
  }
  return esDoc;
}
