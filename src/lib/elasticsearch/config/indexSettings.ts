import * as T from '@elastic/elasticsearch/lib/api/types';
import * as S from './mappingTypes';

export const indexSettings: T.IndicesIndexSettings = {
  settings: {
    index: S.index,
    analysis: S.analysis,
  },
  mappings: {
    properties: {
      // Universal search fields:
      type: S.keywordField,
      url: S.keywordField,
      title: S.suggestUnaggregatedStandardAnalyzerField,
      description: S.unaggregatedStandardAnalyzerTextField,
      searchText: S.unaggregatedStandardAnalyzerTextField,
      keywords: S.unaggregatedStandardAnalyzerTextField,
      boostedKeywords: S.unaggregatedStandardAnalyzerTextField,
      primaryConstituent: S.constituentObjectField,
      startDate: S.dateField,
      endDate: S.dateField,
      language: S.keywordField,

      // Artwork-only fields:
      accessionNumber: S.keywordField,
      classification: S.keywordField,
      startYear: S.integerField,
      endYear: S.integerField,

      // Artist-only fields:
      nationality: S.keywordField,

      // Original Sanity document:
      rawSource: S.disabledObjectField, // don't index original data
    },
  },
};
