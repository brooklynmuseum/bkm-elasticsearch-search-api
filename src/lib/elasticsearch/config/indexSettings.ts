import * as T from '@elastic/elasticsearch/lib/api/types';
import * as S from './mappingTypes';

export const aggFields = [
  'type',
  'classification',
  'primaryConstituent.name',
  'tags',
  'categories',
];

export const indexSettings: T.IndicesIndexSettings = {
  settings: {
    index: S.index,
    analysis: S.analysis,
  },
  mappings: {
    properties: {
      // Universal search fields:
      type: S.searchableAggregatedKeywordAnalyzerField, // Agg
      url: S.keywordField,
      title: S.suggestUnaggregatedStandardAnalyzerField,
      description: S.unaggregatedStandardAnalyzerTextField,
      searchText: S.unaggregatedStandardAnalyzerTextField,
      imageUrl: S.keywordField,
      categories: S.searchableAggregatedKeywordAnalyzerField, // Agg
      tags: S.searchableAggregatedKeywordAnalyzerField, // Agg
      boostedKeywords: S.unaggregatedStandardAnalyzerTextField,
      primaryConstituent: S.constituentObjectField,
      startDate: S.dateField,
      endDate: S.dateField,
      language: S.keywordField,

      // Artwork-only fields:
      accessionNumber: S.keywordField,
      classification: S.searchableAggregatedKeywordAnalyzerField, // Agg
      startYear: S.integerField,
      endYear: S.integerField,

      // Artist-only fields:
      nationality: S.keywordField,

      // Original Sanity document:
      rawSource: S.disabledObjectField, // don't index original data
    },
  },
};
