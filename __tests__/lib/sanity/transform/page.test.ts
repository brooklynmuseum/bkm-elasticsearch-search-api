import transformPage from '@/lib/sanity/transform/page';

describe('transformPage', () => {
  it('transforms page raw source correctly', () => {
    const rawSource = {
      _createdAt: '2023-12-06T23:29:39Z',
      _id: '37d28e2e-fa8c-4e27-9c72-f3d236125613',
      _rev: 'iuFy1qJ1aJqrellFDpHCCU',
      _type: 'page',
      _updatedAt: '2023-12-07T22:25:08Z',
      content: [
        {
          _key: '0737e16ea0ba',
          _type: 'textSection',
          content: [
            {
              _key: 'b2ee82ca77d9',
              _type: 'block',
              children: [
                {
                  _key: 'f13044399604',
                  _type: 'span',
                  marks: [],
                  text: 'Buy em here!',
                },
              ],
              markDefs: [],
              style: 'normal',
            },
          ],
          heading: 'Tickets',
        },
      ],
      coverImage: {
        _type: 'accessibleImage',
        alt: 'BkM',
        asset: {
          _ref: 'image-363216d78dd354df97b276fc60bc346100b91fdd-2560x1920-jpg',
          _type: 'reference',
        },
      },
      heading: 'Boletos',
      isIndex: false,
      language: 'es-US',
      metadata: {
        _type: 'metadata',
        description: 'Meta description for spanish ticketing document',
      },
      route: {
        _createdAt: '2023-12-05T22:08:16Z',
        _id: '9a16ba63-9234-477a-92bd-09f57890aed1',
        _rev: '0p5udQTPrqAQYKCTOZf0ak',
        _type: 'route',
        _updatedAt: '2023-12-07T02:04:24Z',
        path: [
          {
            _key: 'en-US',
            _type: 'internationalizedArrayStringValue',
            value: 'admissions',
          },
          {
            _key: 'es-US',
            _type: 'internationalizedArrayStringValue',
            value: 'admisiones',
          },
        ],
      },
      slug: { _type: 'slug', current: 'boletos' },
      title: 'Boletos',
    };

    const expected = {
      _id: '37d28e2e-fa8c-4e27-9c72-f3d236125613',
      title: 'Boletos',
      url: '/admisiones/boletos',
      searchText: '', // TODO: Fix this
      language: 'es-US',
      rawSource,
    };
    const result = transformPage(rawSource);
    console.log('xxx', result);
    expect(result).toEqual(expected);
  });
});
