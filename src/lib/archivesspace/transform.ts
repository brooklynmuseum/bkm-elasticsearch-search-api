import type { ElasticsearchDocument } from '@/types';
import { mapLanguageToLocale } from '../utils';
import { setIfHasValue, removeHtml } from '../utils';

export interface ArchivesSpaceDocument {
  id: string;
  uri: string;
  title?: string;
  primary_type?: string;
  types?: string[];
  suppressed?: boolean;
  publish?: boolean;
  repository?: string;
  level_enum_s?: string[];
  user_mtime?: string; // User last modified time
  system_mtime?: string; // System last modified time
  agents?: string[];
  creators?: string[];
  resource_type_enum_s?: string[];
  finding_aid_language_enum_s?: string[];
  dates?: string[];
  summary?: string;
  extents?: string[];
  identifier?: string;
  resource_type?: string;
  restrictions?: string;
  langcode?: string[];
  jsonmodel_type?: string;
}

/**
 * Extracts the start and end years from the dates field
 * Use startYear for endYear if there is only one year
 * @param dates The dates field
 * @returns {startYear, endYear} The start and end years
 */
export function extractYears(dates: string[] | undefined): {
  startYear?: number;
  endYear?: number;
} {
  if (!dates || dates.length === 0) {
    return {};
  }

  const dateRange = dates[0].split(' - ');
  const startYear = isNaN(parseInt(dateRange[0])) ? undefined : parseInt(dateRange[0]);
  let endYear =
    dateRange.length > 1 && !isNaN(parseInt(dateRange[1])) ? parseInt(dateRange[1]) : undefined;
  if (startYear && !endYear) {
    endYear = startYear;
  }
  return { startYear, endYear };
}

export function transform(asDoc: ArchivesSpaceDocument): ElasticsearchDocument {
  const { startYear, endYear } = extractYears(asDoc.dates);
  let startDate: string | undefined = undefined;
  let endDate: string | undefined = undefined;
  if (startYear && endYear) {
    startDate = `${startYear}-01-01`;
    endDate = `${endYear}-01-01`;
  }

  const link = `https://archives.brooklynmuseum.org/${asDoc.uri}`;

  const esDoc: ElasticsearchDocument = {
    _id: link,
    type: 'archives',
    url: link,
    subtype: asDoc.primary_type,
    title: asDoc.title,
    description: removeHtml(asDoc.summary),
    // tags: asDoc.resource_type_enum_s, TODO
  };
  setIfHasValue(esDoc, 'startDate', startDate);
  setIfHasValue(esDoc, 'endDate', endDate);
  setIfHasValue(esDoc, 'language', mapLanguageToLocale(asDoc.langcode?.[0]));

  return esDoc;
}
