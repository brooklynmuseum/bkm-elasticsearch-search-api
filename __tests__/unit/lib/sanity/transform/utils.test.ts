import {
  setIfHasValue,
  getBooleanValue,
  portableTextToPlaintext,
  recursivePortableTextToPlaintext,
} from '@/lib/sanity/transform/utils';
import type { JsonData } from '@/types';

describe('setIfHasValue', () => {
  it('should set the key with a non-empty value', () => {
    const obj: JsonData = {};
    setIfHasValue(obj, 'testKey', 'testValue');
    expect(obj).toEqual({ testKey: 'testValue' });
  });

  it('should not set the key if value is undefined', () => {
    const obj: JsonData = {};
    setIfHasValue(obj, 'testKey', undefined);
    expect(obj).toEqual({});
  });

  it('should not set the key if value is null', () => {
    const obj: JsonData = {};
    setIfHasValue(obj, 'testKey', null);
    expect(obj).toEqual({});
  });

  it('should not set the key if value is an empty string', () => {
    const obj: JsonData = {};
    setIfHasValue(obj, 'testKey', '');
    expect(obj).toEqual({});
  });

  it('should set the key with a numeric value', () => {
    const obj: JsonData = {};
    setIfHasValue(obj, 'testKey', 123);
    expect(obj).toEqual({ testKey: 123 });
  });

  it('should set the key with a boolean value', () => {
    const obj: JsonData = {};
    setIfHasValue(obj, 'testKey', true);
    expect(obj).toEqual({ testKey: true });
  });
});

describe('getBooleanValue', () => {
  it('should return the same boolean value for boolean inputs', () => {
    expect(getBooleanValue(true)).toBe(true);
    expect(getBooleanValue(false)).toBe(false);
  });

  it('should return true for string "true" (case insensitive) and "1"', () => {
    expect(getBooleanValue('true')).toBe(true);
    expect(getBooleanValue('TRUE')).toBe(true);
    expect(getBooleanValue('1')).toBe(true);
  });

  it('should return false for other string values', () => {
    expect(getBooleanValue('false')).toBe(false);
    expect(getBooleanValue('0')).toBe(false);
    expect(getBooleanValue('any other string')).toBe(false);
  });

  it('should return true for number 1 and false for other numbers', () => {
    expect(getBooleanValue(1)).toBe(true);
    expect(getBooleanValue(0)).toBe(false);
    expect(getBooleanValue(-1)).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(getBooleanValue(null)).toBe(false);
    expect(getBooleanValue(undefined)).toBe(false);
  });
});

describe('portableTextToPlaintext', () => {
  it('converts portable text to plain text', () => {
    const portableText = [
      {
        _key: '8fb23fb16684',
        _type: 'block',
        children: [
          {
            _key: '0c58f870a0730',
            _type: 'span',
            marks: [],
            text: 'Take a ',
          },
          {
            _key: '43250e91fc80',
            _type: 'span',
            marks: ['em'],
            text: 'rare glimpse',
          },
          {
            _key: 'c423fead2ab7',
            _type: 'span',
            marks: [],
            text: ' into the world of Spike Lee (born Atlanta, Georgia, 1957; raised in Brooklyn, New York), one of the most influential and prolific American filmmakers and directors. Through an immersive installation of objects drawn from Lee’s personal collection, visitors will discover the sources of inspiration that have fueled his creative output.',
          },
        ],
        markDefs: [],
        style: 'normal',
      },
    ];

    const expectedPlaintext =
      'Take a rare glimpse into the world of Spike Lee (born Atlanta, Georgia, 1957; raised in Brooklyn, New York), one of the most influential and prolific American filmmakers and directors. Through an immersive installation of objects drawn from Lee’s personal collection, visitors will discover the sources of inspiration that have fueled his creative output.';

    const result = portableTextToPlaintext(portableText);

    expect(result).toEqual(expectedPlaintext);
  });
});

describe('recursivePortableTextToPlaintext', () => {
  it('converts sections of portable text to plain text', () => {
    const content = [
      {
        _key: 'd6adc1799587',
        _type: 'textSection',
        content: [
          {
            _key: '731b50f16d8e',
            _type: 'block',
            children: [
              {
                _key: '5c2880644e48',
                _type: 'span',
                marks: [],
                text: 'More info!',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
        ],
        heading: 'Test Text Section',
      },
    ];

    const expectedPlaintext = 'More info!';
    const result = recursivePortableTextToPlaintext(content);
    expect(result).toEqual(expectedPlaintext);
  });

  it('converts sections of portable text to plain text', () => {
    const content = {
      _createdAt: '2023-12-11T17:05:23Z',
      _id: '232b72a6-3b97-41fe-bfc4-33c5649dda83',
      _rev: '2cBQ3sunki5PVcZSBgT263',
      _type: 'exhibition',
      _updatedAt: '2023-12-11T17:09:50Z',
      content: [
        {
          _key: 'd6adc1799587',
          _type: 'textSection',
          content: [
            {
              _key: '731b50f16d8e',
              _type: 'block',
              children: [
                {
                  _key: '5c2880644e48',
                  _type: 'span',
                  marks: [],
                  text: 'More info!',
                },
              ],
              markDefs: [],
              style: 'normal',
            },
          ],
          heading: 'Test Text Section',
        },
      ],
      coverImage: {
        _type: 'accessibleImage',
        alt: 'Spike Lee, 2023',
        asset: {
          _createdAt: '2023-12-11T17:04:48Z',
          _id: 'image-e35c538870b3a61e48fc359fbc167f6832c61d57-600x600-png',
          _rev: 'XYP94SU3g2jIRsylTTxppx',
          _type: 'sanity.imageAsset',
          _updatedAt: '2023-12-11T17:04:48Z',
          assetId: 'e35c538870b3a61e48fc359fbc167f6832c61d57',
          extension: 'png',
          metadata: {
            _type: 'sanity.imageMetadata',
            blurHash: 'eAJG{2of00VsD400s.pItR~W00kB_Noz8_8_ofS$ni?HAIs:VXj[kq',
            dimensions: {
              _type: 'sanity.imageDimensions',
              aspectRatio: 1,
              height: 600,
              width: 600,
            },
            hasAlpha: true,
            isOpaque: true,
            lqip: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFXUlEQVQ4jSWT61OTBxaH35nudLrTunV3nOnOOp3ZVt3qOlNtrUsda3eteMG2VrmFQEIkEJAmkBtvEkIIlzQkQMI993JbiICoGLSAimAtDHcIuGXWDhV3/5FnJ9kPZ845X54z5/c7RxBVX1CaewrZ1WNcvXCAc6ff4dTHezl29C2OfPAGhw6+zsEDr3HowG84dOh1jhz+Lcc/fJMTH+3h5Im3+dvHv+PE8beSfcrJvQgN+gyqSi5hUqaik3/ODcmnFKZ/gvzKR+SmHaXwH/sxfrYH09m9qM7tJyv1L1y7cIT0C4fJvHiErIuHyTj/AVkX/0re1x8itIpynOp0GtTpuDWZuDSZONUZOG5cpSn/LL1fv8eTr/awKP0D93IP4FWcobroS6qKLmNLROH/o6b4Ct99m44QsJXQaS7AZ1ESsBYRrFIRtKkIGPMIZacwdHYfT796m3XpPmaz/kj0egphi5xQbQmhmmKC9mIC1SpC9mIitaUIvU49fQ0G+l16+hv0DLj0DDYaGLQX0S09RTh1P7eyD/LD9aMMZbxPtzyFqEPFaGclox0WRtrNDLWI3PQaiXqMCL7qUoK1GsJ1GiL1Gr53lNHvNjDiNXHbriJaeonh4r9zV3OeAfVlggYJEce39DXp6WvS0efW0esqp6ehjIhDjdCgzqJRm0OzLhePPpc2UUGP28TkYJjF2E1mIy5GzbkMV+QQa6km1usn6vfgr9fhFfPxGGW0iHISXiRqwatJp1WbRbteQodeQshayIOeDp7P/cTL9TWeT4/zMODgXouV+bEhtheXWH/2LAn224ppM0rpNMnoMMlpF+UInYZsfBVSQhYZQbOMPkc5s3dusrMR57/Pt9hZesbW4zHWJm+zPf+UV1tb7Gw+58f7Y/S6RAJWBaFqJSGbkqBNidCqzaTDIElCuxLgGjWx/m7icwvsbm7yn/gqu+tL7Kwu8mJxnhcL82z8NM+DkSEiThF/ZT5+q4JAVUESLHjUV2lPQLWZyewzKxnwOpm+O8a/FhZ4FV/jVXyVF3MzxG/3shwNMTM8wGiwnZBdQ5tBQqs+m04xj0ClAiEB8VdI8VXk4DNKiVgKGKzVMubzMjd+l1+W5thdX2Z76g4LHgOPbEomWuyMd9Txvf0GLfrsJLDLkp9cW+iqyMFvkdNllieFDVkU3LQoiDk0TIebWIlF2X4yzs/j/2S+ScuEmM2Uo5SYW0fAqqTVJMNnVRCuUdHjuIHgKUunuTyDRk3i9dLpFOXcqtcw1Whg3K1nrNnMs4iT9b4GFlq1PK6V88hdzu1GE15TEc1GWVK/SOIR6koQnKo06pXnqVGcxVn8JX0ukbk7UVbHR5gINzPgMhFrFvnRU85s/XUmHSqe9rYxMzpEwF2DU5dHe0UugYQ5CQ1dpVeoL7pIzfVztBpyeDgY5JeVFXbWVlmcijHW3cEtr40HNUVMVOYy1Wpl7eF9tpdWiA3202QupkmXTbuYR5uYh9Csl+LWZuEqSydcp2b+/ggv4xv8urHG2swk4/0+Bt0WhkQZoyYZj8JN/Dw3kzypuYkHhFyVtJgVdFUV4KsuRGjU5eDWSnDrJPS4K1iaivFyM86/lxeYHO6j2abFWpSJNecc9flpDHrsbD59yKvNTVZnpol2fIe/WpU0pdtRimBVpFIp/4JKRSqBei3Lj39ITl+ZeYzbbubCmU84c/zPpJ18l29OH8RSKmU2NsxufIPlJ9NE3FbcmgxadZl0ilIEY/Zp9FmfopecJuDQszbziN2tLWbv36NQLuHdP/2eY++9yTcp+0g7uQ/Ztc+42+/n1/VVFqenaasTsRVcwlVyGU/ZNf4HhQjsbuPIG0IAAAAASUVORK5CYII=',
            palette: {
              _type: 'sanity.imagePalette',
              darkMuted: {
                _type: 'sanity.imagePaletteSwatch',
                background: '#5c4c32',
                foreground: '#fff',
                population: 3.28,
                title: '#fff',
              },
              darkVibrant: {
                _type: 'sanity.imagePaletteSwatch',
                background: '#80300f',
                foreground: '#fff',
                population: 2.82,
                title: '#fff',
              },
              dominant: {
                _type: 'sanity.imagePaletteSwatch',
                background: '#997e64',
                foreground: '#fff',
                population: 6.61,
                title: '#fff',
              },
              lightMuted: {
                _type: 'sanity.imagePaletteSwatch',
                background: '#d6c0ad',
                foreground: '#000',
                population: 1.19,
                title: '#fff',
              },
              lightVibrant: {
                _type: 'sanity.imagePaletteSwatch',
                background: '#f6d6cf',
                foreground: '#000',
                population: 0.32,
                title: '#000',
              },
              muted: {
                _type: 'sanity.imagePaletteSwatch',
                background: '#997e64',
                foreground: '#fff',
                population: 6.61,
                title: '#fff',
              },
              vibrant: {
                _type: 'sanity.imagePaletteSwatch',
                background: '#e17e43',
                foreground: '#fff',
                population: 3.73,
                title: '#fff',
              },
            },
          },
          mimeType: 'image/png',
          originalFilename: 'image.png',
          path: 'images/kzj21sz4/production/e35c538870b3a61e48fc359fbc167f6832c61d57-600x600.png',
          sha1hash: 'e35c538870b3a61e48fc359fbc167f6832c61d57',
          size: 717038,
          uploadId: '7AFrTEfMwe4KQPt7fL7I31zMiFmjY154',
          url: 'https://cdn.sanity.io/images/kzj21sz4/production/e35c538870b3a61e48fc359fbc167f6832c61d57-600x600.png',
        },
      },
      description: [
        {
          _key: '8fb23fb16684',
          _type: 'block',
          children: [
            {
              _key: '0c58f870a0730',
              _type: 'span',
              marks: [],
              text: 'Take a ',
            },
            {
              _key: '43250e91fc80',
              _type: 'span',
              marks: ['em'],
              text: 'rare glimpse',
            },
            {
              _key: 'c423fead2ab7',
              _type: 'span',
              marks: [],
              text: ' into the world of Spike Lee (born Atlanta, Georgia, 1957; raised in Brooklyn, New York), one of the most influential and prolific American filmmakers and directors. Through an immersive installation of objects drawn from Lee’s personal collection, visitors will discover the sources of inspiration that have fueled his creative output.',
            },
          ],
          markDefs: [],
          style: 'normal',
        },
      ],
      endsAt: '2024-02-04',
      language: 'en-US',
      slug: { _type: 'slug', current: 'spike-lee-creative-sources' },
      startsAt: '2023-10-07',
      title: 'Spike Lee: Creative Sources',
    };

    const expectedPlaintext =
      'More info!  Take a rare glimpse into the world of Spike Lee (born Atlanta, Georgia, 1957; raised in Brooklyn, New York), one of the most influential and prolific American filmmakers and directors. Through an immersive installation of objects drawn from Lee’s personal collection, visitors will discover the sources of inspiration that have fueled his creative output.';
    const result = recursivePortableTextToPlaintext(content);
    expect(result).toEqual(expectedPlaintext);
  });

  it('converts undefined to blank string', () => {
    const content = undefined;
    const expectedPlaintext = '';
    const result = recursivePortableTextToPlaintext(content);
    expect(result).toEqual(expectedPlaintext);
  });
});
