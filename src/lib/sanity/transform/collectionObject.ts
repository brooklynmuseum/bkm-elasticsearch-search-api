import { JsonData } from '../../../types';
import { setIfHasValue } from '../../various';

export default function transformCollectionObject(collectionObject: JsonData): JsonData {
  const esDoc: JsonData = {
    _id: collectionObject._id,
    rawSource: collectionObject,
  };
  setIfHasValue(esDoc, 'title', collectionObject.title);
  setIfHasValue(esDoc, 'description', collectionObject.description);
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
    if (primaryConstituent && primaryConstituent.artist.name) {
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
      if (cultureConstituent && cultureConstituent.artist && cultureConstituent.artist.name) {
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
