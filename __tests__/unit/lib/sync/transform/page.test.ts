import transformPage from '@/lib/sync/transform/page';

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
          _createdAt: '2023-10-05T19:23:27Z',
          _id: 'image-363216d78dd354df97b276fc60bc346100b91fdd-2560x1920-jpg',
          _rev: 'XRwJ1jwul0uiX4UjPghVcR',
          _type: 'sanity.imageAsset',
          _updatedAt: '2023-10-05T19:23:27Z',
          assetId: '363216d78dd354df97b276fc60bc346100b91fdd',
          extension: 'jpg',
          metadata: {
            _type: 'sanity.imageMetadata',
            blurHash: 'VjL|_rIptSt7Rj?wWYt8j[V@?vj]kCWBj?g4WXRjj[j[',
            dimensions: {
              _type: 'sanity.imageDimensions',
              aspectRatio: 1.3333333333333333,
              height: 1920,
              width: 2560,
            },
            hasAlpha: false,
            isOpaque: true,
            lqip: 'data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAPABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAYFB//EACIQAAEDAwQDAQAAAAAAAAAAAAECAwQABhEFEhMhIjGBMv/EABYBAQEBAAAAAAAAAAAAAAAAAAMBAv/EABoRAAMBAAMAAAAAAAAAAAAAAAABAgMSEzH/2gAMAwEAAhEDEQA/AOnz78jtMER2FpcPQUewKWxe0hctbclfMhOSrA7FSAtaeCVN8Lo3dB1R9fK1oekasw4eKPBCFjzO45NDpvVULOaS8LtV9wAcGO9n5SoeRakl5zel7YCPyFeqVrsZOCP/2Q==',
            palette: {
              _type: 'sanity.imagePalette',
              darkMuted: {
                _type: 'sanity.imagePaletteSwatch',
                background: '#372f29',
                foreground: '#fff',
                population: 6.66,
                title: '#fff',
              },
              darkVibrant: {
                _type: 'sanity.imagePaletteSwatch',
                background: '#947e3c',
                foreground: '#fff',
                population: 1.99,
                title: '#fff',
              },
              dominant: {
                _type: 'sanity.imagePaletteSwatch',
                background: '#372f29',
                foreground: '#fff',
                population: 6.66,
                title: '#fff',
              },
              lightMuted: {
                _type: 'sanity.imagePaletteSwatch',
                background: '#d5c1b1',
                foreground: '#000',
                population: 4.43,
                title: '#fff',
              },
              lightVibrant: {
                _type: 'sanity.imagePaletteSwatch',
                background: '#d4e3fa',
                foreground: '#000',
                population: 3.12,
                title: '#000',
              },
              muted: {
                _type: 'sanity.imagePaletteSwatch',
                background: '#5065a7',
                foreground: '#fff',
                population: 0.13,
                title: '#fff',
              },
              vibrant: {
                _type: 'sanity.imagePaletteSwatch',
                background: '#d3c15e',
                foreground: '#000',
                population: 0.3,
                title: '#fff',
              },
            },
          },
          mimeType: 'image/jpeg',
          originalFilename: 'bkmfacade.jpg',
          path: 'images/kzj21sz4/production/363216d78dd354df97b276fc60bc346100b91fdd-2560x1920.jpg',
          sha1hash: '363216d78dd354df97b276fc60bc346100b91fdd',
          size: 1475060,
          uploadId: 'oayyGg2pgJOBYqDzfASzSHi5rSn7QxZ3',
          url: 'https://cdn.sanity.io/images/kzj21sz4/production/363216d78dd354df97b276fc60bc346100b91fdd-2560x1920.jpg',
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
      type: 'page',
      url: 'https://brooklynmuseum.org/admisiones/boletos',
      title: 'Boletos',
      imageUrl:
        'https://cdn.sanity.io/images/kzj21sz4/production/363216d78dd354df97b276fc60bc346100b91fdd-2560x1920.jpg',
      searchText: '', // TODO: Fix this
      language: 'es-US',
      rawSource,
    };
    const result = transformPage(rawSource, 'https://brooklynmuseum.org');
    expect(result).toEqual(expected);
  });
});
