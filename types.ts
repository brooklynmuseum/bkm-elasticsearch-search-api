
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

export interface ElasticsearchImage {
  id?: string;
  url?: string;
  thumbnailUrl?: string;
  alt?: string;
  date?: string;
  view?: string;
  rank?: number;
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
  image?: ElasticsearchImage;
  startDate?: string;
  endDate?: string;
  startYear?: number;
  endYear?: number;
  original?: any;
}