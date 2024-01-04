import { transform, extractYears } from '@/lib/archivesspace/transform';
import type { ArchivesSpaceDocument } from '@/lib/archivesspace/transform';
import type { ElasticsearchDocument } from '@/types';

describe('ArchivesSpace extractYears', () => {
  it('returns an empty object for undefined input', () => {
    expect(extractYears(undefined)).toEqual({});
  });

  it('extracts a single year correctly', () => {
    expect(extractYears(['1930'])).toEqual({ startYear: 1930, endYear: 1930 });
  });

  it('extracts a year range correctly', () => {
    expect(extractYears(['1897 - 1904'])).toEqual({ startYear: 1897, endYear: 1904 });
  });

  it('handles invalid year inputs correctly', () => {
    expect(extractYears(['invalid'])).toEqual({});
  });
});

describe('ArchivesSpace transform', () => {
  it('transforms ArchivesSpaceDocument to ElasticsearchDocument correctly', () => {
    const asDocument: ArchivesSpaceDocument = {
      id: '/repositories/2/resources/2',
      title: 'Office of the Director records',
      primary_type: 'resource',
      repository: '/repositories/2',
      user_mtime: '2023-06-13T19:41:33Z',
      system_mtime: '2023-06-13T19:41:33Z',
      dates: ['1913 - 2015'],
      summary:
        'The collection is comprised of documents pertaining to the Directors of the Brooklyn Museum...',
      extents: ['353.5416 linear_feet'],
      identifier: 'DIR',
      resource_type: 'records',
      restrictions: 'true',
      langcode: ['eng'],
      jsonmodel_type: 'resource',
    };

    const expected: ElasticsearchDocument = {
      _id: '/repositories/2/resources/2',
      type: 'resource',
      title: 'Office of the Director records',
      description:
        'The collection is comprised of documents pertaining to the Directors of the Brooklyn Museum...',
      startDate: '01-01-1913',
      endDate: '01-01-2015',
      language: 'en-US',
    };

    const result = transform(asDocument);
    expect(result).toEqual(expected);
  });

  // Additional tests can be added here...
});
