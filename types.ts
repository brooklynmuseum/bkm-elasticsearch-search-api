
export type JsonData = { [key: string]: any };
export type DataMap = Map<string, JsonData>;

export interface ElasticsearchConstituent {
  id?: string;
  name: string;
  canonicalName: string;
  prefix?: string;
  suffix?: string;
  dates?: string;
  birthYear?: number;
  deathYear?: number;
  nationality?: string[];
  gender?: string;
  role?: string;
  rank?: number;
}

export interface ElasticsearchGeographicalLocation {
  id?: string;
  name: string;
  continent?: string;
  country?: string;
  type?: string;
}

export interface ElasticsearchMuseumLocation {
  id?: string;
  name?: string;
  isPublic?: boolean;
  isFloor?: boolean;
  parentId?: string;
}

export interface ElasticsearchDocument {
  _id?: string;
  _index?: string;
  type?: string;
  url?: string;
  title?: string;
  description?: string;
  searchText?: string;
  keywords?: string[];
  boostedKeywords?: string[];
  primaryConstituent?: ElasticsearchConstituent;
  startDate?: string;
  endDate?: string;
  // Artwork fields:
  accessionNumber?: string;
  classification?: string;
  startYear?: number;
  endYear?: number;
  // Artist fields:
  nationality?: string;
  // Original Sanity document:
  rawSource?: any;
}


export interface SearchResponseMetadata {
  count?: number;
  pages?: number;
}

export interface SearchResponse {
  query?: any;
  data?: any;
  terms?: any;
  filters?: any;
  options?: any;
  metadata?: SearchResponseMetadata;
  apiError?: string;
  error?: any;
}

export interface AggOption {
  key: string;
  doc_count: number;
}

export interface Agg {
  name: string;
  displayName: string;
  options?: Array<AggOption>;
}

export interface AggOptions {
  [k: string]: AggOption[];
}
