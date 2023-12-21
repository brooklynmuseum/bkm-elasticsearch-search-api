import { portableTextToPlaintext } from '@/lib/sync/transform/utils';

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
      'Take a rare glimpse into the world of Spike Lee (born Atlanta, Georgia, 1957; raised in Brooklyn, New York), one of the most influential and prolific American filmmakers and directors. Through an immersive installation of objects drawn from Lee’s personal collection, visitors will discover the sources of inspiration that have fueled his creative output.';

    const result = portableTextToPlaintext(portableText);

    expect(result).toEqual(expectedPlaintext);
  });
});
