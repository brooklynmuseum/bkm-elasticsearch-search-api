import transformCollectionArtist from '@/lib/sanity/transform/collectionArtist';

describe('transformCollectionArtist', () => {
  it('transforms collectionArtist raw source correctly', () => {
    const rawSource = {
      _createdAt: '2023-11-20T17:08:44Z',
      _id: 'collection_artist_21279',
      _rev: 'Uckd0KyIppGAIvpptVFZCf',
      _type: 'collectionArtist',
      _updatedAt: '2023-11-20T17:08:44Z',
      dateAdded: '2022-12-13T05:00:00.000Z',
      dates: 'American, born El Salvador, born 1976',
      endYear: 9999,
      name: 'Guadalupe Maravilla',
      nationality: 'American, born El Salvador',
      startYear: 1976,
    };
    const expected = {
      _id: 'collection_artist_21279',
      type: 'collectionArtist',
      title: 'Guadalupe Maravilla',
      description: 'American, born El Salvador, born 1976',
      nationality: 'American, born El Salvador',
      startYear: 1976,
      endYear: 9999,
      language: 'en-US',
      rawSource,
    };

    const result = transformCollectionArtist(rawSource);
    expect(result).toEqual(expected);
  });
});
