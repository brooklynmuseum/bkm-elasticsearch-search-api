import { setIfHasValue } from '../sanity/transform/utils';
import type { ElasticsearchDocument, ElasticsearchConstituent } from '@/types';

// Represents a document with metadata and detailed information.
export interface PrimoDocument {
  context: string; // Context of the document, possibly denoting its origin or category.
  adaptor: string; // The source adaptor used.
  '@id': string; // Unique identifier URL for the document.
  pnx: PNX; // Detailed information container.
}

// Contains detailed information about the document.
interface PNX {
  display: Display; // Display-related information.
  control: Control; // Control information like record IDs and source.
  addata: Addata; // Additional data associated with the document.
  sort: Sort; // Sorting related fields.
  facets: Facets; // Faceted classification data.
}

// Display information of the document.
interface Display {
  source?: string[]; // Source of the document.
  type?: string[]; // Type of the document, e.g., book.
  language?: string[]; // Language(s) of the document.
  title?: string[]; // Title of the document.
  subject?: string[]; // Subject or topics covered.
  creator?: string[]; // Creator of the document.
  format?: string[]; // Format information.
  identifier?: string[]; // Unique identifiers like ISBN.
  creationdate?: string[]; // Date of creation or publication.
  publisher?: string[]; // Publisher information.
  description?: string[]; // Description or abstract of the document.
  mms?: string[]; // MMS ID.
  contributor?: string[]; // Contributors to the document.
  addtitle?: string[]; // Additional title information.
  contents?: string[]; // Table of contents or summary of contents.
  genre?: string[]; // Genre of the document.
  relation?: string[]; // Relations to other works.
  place?: string[]; // Place of publication.
  version?: string[]; // Version of the document.
  lds01?: string[]; // Custom field, possibly related to specific categorizations.
  lds02?: string[]; // Custom field, possibly additional descriptive text.
  lds18?: string[]; // Custom field, possibly related to specific objects or collections.
  lds19?: string[]; // Custom field.
  lds27?: string[]; // Custom field, possibly including bibliographic references.
  lds34?: string[]; // Custom field.
  // any field:
  [key: string]: string[] | undefined;
}

// Control information of the document.
interface Control {
  sourcerecordid?: string[]; // Source record ID.
  recordid?: string[]; // Record ID.
  sourceid?: string; // Source ID.
  originalsourceid?: string[]; // Original source ID.
  sourcesystem?: string[]; // System from which the source is derived.
  sourceformat?: string[]; // Format of the source data.
  score?: string[]; // Relevance score.
  isDedup?: boolean; // Indicates if deduplication has been applied.
}

// Additional data associated with the document.
interface Addata {
  au?: string[]; // Author information, first and last name.
  aulast?: string[]; // Author's last name.
  aufirst?: string[]; // Author's first name.
  auinit?: string[]; // Author's initials.
  addau?: string[]; // Additional author information.
  contributorfull?: string[]; // Full list of contributors.
  creatorfull?: string[]; // Full list of creators.
  addtitle?: string[]; // Additional title.
  date?: string[]; // Publication dates.
  isbn?: string[]; // ISBN numbers.
  notes?: string[]; // Notes about the document.
  abstract?: string[]; // Abstract of the document.
  cop?: string[]; // Place of publication.
  pub?: string[]; // Publisher information.
  oclcid?: string[]; // OCLC ID.
  lccn?: string[]; // Library of Congress Control Number.
  format?: string[]; // PrimoDocument format.
  genre?: string[]; // PrimoDocument genre.
  ristype?: string[]; // Resource type.
  btitle?: string[]; // Base title of the document.
}

// Sorting related fields.
interface Sort {
  title?: string[]; // Sorted title.
  author?: string[]; // Sorted author.
  creationdate?: string[]; // Sorted creation date.
}

// Faceted classification data.
interface Facets {
  frbrtype?: string[]; // FRBR (Functional Requirements for Bibliographic Records) type.
  frbrgroupid?: string[]; // FRBR group ID.
}

export function mapLanguage(language: string | undefined): string | undefined {
  if (language === 'eng') return 'en-US';
  if (language === 'spa') return 'es-ES';
}

export function transform(document: PrimoDocument): ElasticsearchDocument | undefined {
  // Assume the first contributor is the primary
  const primaryContributor =
    document.pnx.display.creator?.[0] || document.pnx.display.contributor?.[0];
  let primaryConstituent: ElasticsearchConstituent | undefined = undefined;

  if (primaryContributor) {
    // "Little, Myles, 1984- editor.$$QLittle, Myles", "Dyer, Geoff, author.$$QDyer, Geoff", "Stiglitz, Joseph E., author.$$QStiglitz, Joseph E."
    const parts = primaryContributor.split('$$Q');
    primaryConstituent = {
      id: parts[0],
      name: parts[1],
    };
  }

  let startDate: string | undefined = undefined;
  let startYear: number | undefined = undefined;
  if (document.pnx.display.creationdate?.[0]) {
    startDate = '01-01-' + document.pnx.display.creationdate?.[0];
    startYear = parseInt(document.pnx.display.creationdate?.[0]);
  }

  const id = document.pnx.control.recordid?.[0];
  if (!id) return undefined;
  const link = `https://library.brooklynmuseum.org/permalink/01NYA_INST/augm1n/${id}`;

  const esDoc: ElasticsearchDocument = {
    _id: id,
    type: document.context,
    url: link,
    title: document.pnx.display.title?.join(', ')?.trim(),
    tags: document.pnx.display.subject,
    rawSource: document,
  };

  setIfHasValue(esDoc, 'description', document.pnx.display.description?.join(' ')?.trim());
  setIfHasValue(esDoc, 'searchText', document.pnx.display.contents?.join(' ')?.trim());
  setIfHasValue(esDoc, 'language', mapLanguage(document.pnx.display.language?.[0]));
  setIfHasValue(esDoc, 'primaryConstituent', primaryConstituent);
  setIfHasValue(esDoc, 'startDate', startDate);
  setIfHasValue(esDoc, 'startYear', startYear);
  setIfHasValue(esDoc, 'endDate', startDate);
  setIfHasValue(esDoc, 'endYear', startYear);

  return esDoc;
}
