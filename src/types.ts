export type JsonData = { [key: string]: any };
export type DataMap = Map<string, JsonData>;

export type SanityRoute = {
  path?: Array<{
    _key: string;
    _type: string;
    value: string;
  }>;
  subroutes?: SanityRoute[];
};

export type SanitySlug = {
  _type: string;
  current?: string;
};

export interface ElasticsearchConstituent {
  id?: string;
  name: string;
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
  imageUrl?: string;
  categories?: string[];
  tags?: string[];
  boostedKeywords?: string[];
  primaryConstituent?: ElasticsearchConstituent;
  startDate?: string;
  endDate?: string;
  language?: string;

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

export interface ApiSearchParams {
  pageNumber: number;
  resultsPerPage: number;
  query?: string;
  type?: string;
  classification?: string;
  'primaryConstituent.name': string;
  tags?: string;
  categories?: string;
  [key: string]: any;
}

export interface ApiSearchResponseMetadata {
  total?: number;
  pages?: number;
}

export interface ApiSearchResponse {
  query?: any;
  data?: any;
  terms?: any;
  filters?: any;
  options?: any;
  metadata?: ApiSearchResponseMetadata;
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
