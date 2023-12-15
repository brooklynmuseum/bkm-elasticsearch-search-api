import transformProduct from '@/lib/sanity/transform/product';

describe('transformPage', () => {
  it('transforms product raw source correctly', () => {
    const rawSource = {
      _createdAt: '2023-10-31T17:44:22Z',
      _id: 'shopifyProduct-7480139612356',
      _rev: 'ZZiJJd1zoc33D9f7kkYo5x',
      _type: 'product',
      _updatedAt: '2023-11-29T22:01:06Z',
      store: {
        createdAt: '2023-10-31T13:44:19-04:00',
        descriptionHtml: '',
        gid: 'gid://shopify/Product/7480139612356',
        id: 7480139612356,
        isDeleted: false,
        options: [
          {
            _key: 'Title',
            _type: 'option',
            name: 'Title',
            values: ['Default Title'],
          },
        ],
        priceRange: { maxVariantPrice: 9.99, minVariantPrice: 9.99 },
        productType: 'Kids',
        slug: { _type: 'slug', current: 'investigators-ants-in-pants' },
        status: 'draft',
        tags: "Children's Bookfair, Event_Children's Bookfair",
        title: 'Investigators: Ants In Pants',
        variants: [
          {
            _key: 'a0ab76c4-ce4d-53be-9915-e55b88cf9c45',
            _ref: 'shopifyProductVariant-42549119156420',
            _type: 'reference',
            _weak: true,
          },
        ],
        vendor: 'Henry Holt Books',
      },
    };

    const expected = {
      _id: 'shopifyProduct-7480139612356',
      title: 'Investigators: Ants In Pants',
      searchText: 'Henry Holt Books',
      language: 'es-US',
      keywords: ["Children's Bookfair", "Event_Children's Bookfair"],
      rawSource,
    };
    const result = transformProduct(rawSource);
    expect(result).toEqual(expected);
  });
});
