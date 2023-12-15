import transformExhibition from '@/lib/sanity/transform/exhibition';

describe('transformExhibition', () => {
  it('transforms exhibition raw source correctly', () => {
    const rawSource = {
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
          _ref: 'image-e35c538870b3a61e48fc359fbc167f6832c61d57-600x600-png',
          _type: 'reference',
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

    const expected = {
      _id: '232b72a6-3b97-41fe-bfc4-33c5649dda83',
      type: 'exhibition',
      title: 'Spike Lee: Creative Sources',
      description:
        'Take a rare glimpse into the world of Spike Lee (born Atlanta, Georgia, 1957; raised in Brooklyn, New York), one of the most influential and prolific American filmmakers and directors. Through an immersive installation of objects drawn from Lee’s personal collection, visitors will discover the sources of inspiration that have fueled his creative output.',
      startDate: '2023-10-07',
      endDate: '2024-02-04',
      language: 'en-US',
      rawSource,
    };
    const result = transformExhibition(rawSource);
    expect(result).toEqual(expected);
  });
});
