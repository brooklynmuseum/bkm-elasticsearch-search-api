import * as T from '@elastic/elasticsearch/lib/api/types';
import * as S from './settings';

export const indexSettings: T.IndicesIndexSettings = {
  settings: {
    index: S.index,
    analysis: S.analysis,
  },
  mappings: {
    properties: {
      type: S.keywordField,
      url: S.keywordField,
      title: S.suggestUnaggregatedStandardAnalyzerField,
      description: S.unaggregatedStandardAnalyzerTextField,
      searchText: S.unaggregatedStandardAnalyzerTextField,
      keywords: S.unaggregatedStandardAnalyzerTextField,
      boostedKeywords: S.unaggregatedStandardAnalyzerTextField,
      primaryConstituent: S.constituentObjectField,
      image: S.imageObjectField,
      startDate: S.dateField,
      endDate: S.dateField,
      startYear: S.integerField,
      endYear: S.integerField,
      original: S.disabledObjectField, // don't index original data
    }
  }
}
