import { hydrateDocument } from '@/lib/sanity/hydrate';

describe('hydrateDocument', () => {
  /*
   docA (Level 0)
   └── refItem -> docB (Level 1)
      └── refItem -> docC (Level 2)
         └── refItem -> docD (Level 3)
            └── refItem -> docE (Level 4)
  */
  const mockDataMap = new Map([
    ['docA', { _id: 'docA', title: 'Document A', refItem: { _ref: 'docB' } }],
    ['docB', { _id: 'docB', title: 'Document B', refItem: { _ref: 'docC' } }],
    ['docC', { _id: 'docC', title: 'Document C', refItem: { _ref: 'docD' } }],
    [
      'docD',
      {
        _id: 'docD',
        title: 'Document D',
        refItem: { _ref: 'docE' },
        refItem2: { _ref: 'docLoop' },
      },
    ],
    ['docE', { _id: 'docE', title: 'Document E' }],
    ['docLoop', { _id: 'docLoop', title: 'Document Loop', refItem: { _ref: 'docA' } }],
    [
      'docArray',
      {
        _id: 'docArray',
        title: 'Document Array',
        refArray: [{ _ref: 'docA' }, { _ref: 'docA' }, { _ref: 'docB' }],
      },
    ],
    // Similar to constituents array:
    [
      'docObjectArray',
      {
        _id: 'docArray',
        title: 'Document Array',
        refArray: [
          { artist: { _ref: 'docA' }, role: { _ref: 'docC' } },
          { artist: { _ref: 'docA' }, role: { _ref: 'docC' } },
          { artist: { _ref: 'docB' }, role: { _ref: 'docC' } },
        ],
      },
    ],
  ]);

  test('should resolve references correctly', () => {
    const rootDoc = mockDataMap.get('docA');
    if (rootDoc) {
      const hydratedDoc = hydrateDocument(mockDataMap, rootDoc);
      expect(hydratedDoc.refItem.title).toBe('Document B');
      expect(hydratedDoc.refItem.refItem.title).toBe('Document C');
      expect(hydratedDoc.refItem.refItem.refItem.title).toBe('Document D');
      expect(hydratedDoc.refItem.refItem.refItem.refItem.title).toBe('Document E');
      // Should not resolve more than max levels deep:
      expect(hydratedDoc.refItem.refItem.refItem.refItem2.refItem).toEqual({ _ref: 'docA' });
    }
  });

  test('should only resolve loops max levels deep', () => {
    const selfRefDoc = { _id: 'docSelf', title: 'Self-Ref Doc', refItem: { _ref: 'docSelf' } };
    mockDataMap.set('docSelf', selfRefDoc);
    const hydratedDoc = hydrateDocument(mockDataMap, selfRefDoc);
    const result = {
      _id: 'docSelf',
      title: 'Self-Ref Doc',
      refItem: {
        _id: 'docSelf',
        title: 'Self-Ref Doc',
        refItem: {
          _id: 'docSelf',
          title: 'Self-Ref Doc',
          refItem: {
            _id: 'docSelf',
            title: 'Self-Ref Doc',
            refItem: { _id: 'docSelf', title: 'Self-Ref Doc', refItem: { _ref: 'docSelf' } },
          },
        },
      },
    };
    expect(hydratedDoc).toEqual(result);
  });

  test('should handle non-existing references gracefully', () => {
    const brokenRefDoc = { _id: 'docBroken', title: 'Broken Ref Doc', refItem: { _ref: 'docX' } };
    const hydratedDoc = hydrateDocument(mockDataMap, brokenRefDoc);
    expect(hydratedDoc.refItem).toEqual({ _ref: 'docX' });
  });

  test('should resolve all references in an array', () => {
    const docWithArray = mockDataMap.get('docArray');
    if (docWithArray) {
      const hydratedDoc = hydrateDocument(mockDataMap, docWithArray);

      // Check if the array has been resolved correctly
      expect(hydratedDoc.refArray).toBeDefined();
      expect(Array.isArray(hydratedDoc.refArray)).toBe(true);
      expect(hydratedDoc.refArray.length).toBe(3); // Assuming the array has 3 elements

      // Check if individual references within the array are resolved
      expect(hydratedDoc.refArray[0].title).toBe('Document A');
      expect(hydratedDoc.refArray[1].title).toBe('Document A'); // Both first and second references are 'docA'
      expect(hydratedDoc.refArray[2].title).toBe('Document B');
    }
  });

  test('should resolve all references in an array of objects', () => {
    const docWithArray = mockDataMap.get('docObjectArray');
    if (docWithArray) {
      const hydratedDoc = hydrateDocument(mockDataMap, docWithArray);

      // Check if the array has been resolved correctly
      expect(hydratedDoc.refArray).toBeDefined();
      expect(Array.isArray(hydratedDoc.refArray)).toBe(true);
      expect(hydratedDoc.refArray.length).toBe(3); // Assuming the array has 3 elements

      // Check if individual references within the array are resolved
      expect(hydratedDoc.refArray[0].artist.title).toBe('Document A');
      expect(hydratedDoc.refArray[0].role.title).toBe('Document C');
      expect(hydratedDoc.refArray[1].artist.title).toBe('Document A'); // Both first and second references are 'docA'
      expect(hydratedDoc.refArray[1].role.title).toBe('Document C');
      expect(hydratedDoc.refArray[2].artist.title).toBe('Document B');
      expect(hydratedDoc.refArray[2].role.title).toBe('Document C');
    }
  });
});
