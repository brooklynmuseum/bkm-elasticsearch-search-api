import * as T from '@elastic/elasticsearch/lib/api/types';
import * as S from './mappingTypes';

export const aggFields = [
  'type',
  'collection',
  'classification',
  'constituents.name',
  'museumLocation',
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
      subtype: S.searchableAggregatedKeywordAnalyzerField, // Agg
      url: S.keywordField,
      title: S.suggestUnaggregatedStandardAnalyzerField,
      description: S.unaggregatedStandardAnalyzerTextField,
      searchText: S.unaggregatedStandardAnalyzerTextField,
      imageUrl: S.keywordField,
      categories: S.searchableAggregatedKeywordAnalyzerField, // Agg
      tags: S.searchableAggregatedKeywordAnalyzerField, // Agg
      boostedKeywords: S.unaggregatedStandardAnalyzerTextField,
      constituents: S.constituentObjectField,

      // Two date fields for date range queries, accomodates artworks which
      // have start/end years stretching back far beyond unix epoch, e.g. -500 (500 BCE)
      startDate: S.dateField,
      startYear: S.integerField,
      endDate: S.dateField,
      endYear: S.integerField,

      language: S.keywordField,

      // Artwork-only fields:
      accessionNumber: S.keywordField,
      classification: S.searchableAggregatedKeywordAnalyzerField, // Agg
      collection: S.searchableAggregatedKeywordAnalyzerField, // Agg
      museumLocation: S.searchableAggregatedKeywordAnalyzerField, // Agg
      visible: S.booleanField,
      publicAccess: S.booleanField,

      // Artist-only fields:
      nationality: S.keywordField,

      // Original Sanity document:
      rawSource: S.disabledObjectField, // don't index original data
    },
  },
};
