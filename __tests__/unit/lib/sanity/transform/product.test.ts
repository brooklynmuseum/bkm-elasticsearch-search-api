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
        previewImageUrl:
          'https://cdn.shopify.com/s/files/1/0780/5601/products/22_image_naturalcopy.png?v=1644363262',
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
      type: 'product',
      url: 'https://shop.brooklynmuseum.org/products/investigators-ants-in-pants',
      title: 'Investigators: Ants In Pants',
      imageUrl:
        'https://cdn.shopify.com/s/files/1/0780/5601/products/22_image_naturalcopy.png?v=1644363262',
      tags: ["Children's Bookfair", "Event_Children's Bookfair"],
      rawSource,
    };
    const result = transformProduct(rawSource, 'https://brooklynmuseum.org');
    expect(result).toEqual(expected);
  });

  it('transforms product raw source containing html codes correctly', () => {
    const rawSource = {
      _createdAt: '2023-10-12T16:19:37Z',
      _id: 'shopifyProduct-7343089516740',
      _rev: '01fz37KtvhMj2e8zIVfd5K',
      _type: 'product',
      _updatedAt: '2023-11-29T22:01:52Z',
      store: {
        createdAt: '2023-02-23T15:29:19-05:00',
        descriptionHtml:
          '\u003cp\u003e\u003cspan\u003eLearning to ride is no easy feat! But with a little courage, a guiding hand from her dad, and an enthusiastic bark from her pup, one brave girl quickly learns the freedom that comes from an afternoon spent outside on a bike.\u003c/span\u003e\u003c/p\u003e\n\u003cp\u003e\u003cspan\u003eExperience the fear, the anticipation, and the delight of achieving the ultimate milestone in this energetic, warm story that celebrates the precious bond between parent and child.\u003c/span\u003e\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003eProduct Details\u003c/strong\u003e\u003c/p\u003e\n\u003cp\u003eHardcover\u003c/p\u003e\n\u003cp\u003e\u003cmeta charset="utf-8"\u003e36 pages \u003c/p\u003e\n\u003cp\u003e\u003cspan data-mce-fragment="1"\u003e9.05 x 0.5 x 9.9 in.\u003c/span\u003e\u003c/p\u003e\n\u003cp\u003e\u003cspan data-mce-fragment="1"\u003eISBN: 9781797212487\u003c/span\u003e\u003c/p\u003e\n\u003cp\u003eAges 4-7\u003c/p\u003e',
        gid: 'gid://shopify/Product/7343089516740',
        id: 7343089516740,
        isDeleted: false,
        options: [
          {
            _key: 'Title',
            _type: 'option',
            name: 'Title',
            values: ['Default Title'],
          },
        ],
        previewImageUrl:
          'https://cdn.shopify.com/s/files/1/0780/5601/products/togetherweride.png?v=1680211207',
        priceRange: { maxVariantPrice: 16.99, minVariantPrice: 16.99 },
        productType: 'Kids',
        slug: { _type: 'slug', current: 'together-we-ride' },
        status: 'archived',
        tags: 'Brand_Chronicle Books, Type_Books',
        title: 'Together We Ride by Valerie Bolling',
        variants: [
          {
            _createdAt: '2023-10-12T16:19:37Z',
            _id: 'shopifyProductVariant-42110189994180',
            _rev: '01fz37KtvhMj2e8zIVfd5K',
            _type: 'productVariant',
            _updatedAt: '2023-11-29T22:01:52Z',
            store: {
              compareAtPrice: 0,
              createdAt: '2023-02-23T15:29:19-05:00',
              gid: 'gid://shopify/ProductVariant/42110189994180',
              id: 42110189994180,
              inventory: {
                isAvailable: false,
                management: 'SHOPIFY',
                policy: 'DENY',
              },
              isDeleted: false,
              option1: 'Default Title',
              option2: '',
              option3: '',
              price: 16.99,
              productGid: 'gid://shopify/Product/7343089516740',
              productId: 7343089516740,
              sku: '9781797212487',
              status: 'archived',
              title: 'Default Title',
            },
          },
        ],
        vendor: 'Chronicle Books',
      },
    };

    const expected = {
      _id: 'shopifyProduct-7343089516740',
      type: 'product',
      url: 'https://shop.brooklynmuseum.org/products/together-we-ride',
      title: 'Together We Ride by Valerie Bolling',
      imageUrl:
        'https://cdn.shopify.com/s/files/1/0780/5601/products/togetherweride.png?v=1680211207',
      description:
        'Learning to ride is no easy feat! But with a little courage, a guiding hand from her dad, and an enthusiastic bark from her pup, one brave girl quickly learns the freedom that comes from an afternoon spent outside on a bike. Experience the fear, the anticipation, and the delight of achieving the ultimate milestone in this energetic, warm story that celebrates the precious bond between parent and child. Product Details Hardcover 36 pages 9.05 x 0.5 x 9.9 in. ISBN: 9781797212487 Ages 4-7',
      tags: ['Brand_Chronicle Books', 'Type_Books'],
      rawSource,
    };
    const result = transformProduct(rawSource, 'https://brooklynmuseum.org');
    expect(result).toEqual(expected);
  });

  it('transforms deleted product correctly', () => {
    const rawSource = {
      _createdAt: '2023-10-31T19:23:57Z',
      _id: 'shopifyProduct-7480334975172',
      _rev: 'ZZiJJd1zoc33D9f7kkckF2',
      _type: 'product',
      _updatedAt: '2023-11-29T22:49:55Z',
      store: {
        createdAt: '2023-10-31T15:23:55-04:00',
        descriptionHtml: '',
        gid: 'gid://shopify/Product/7480334975172',
        id: 7480334975172,
        isDeleted: true,
      },
    };
    const expected = undefined;
    const result = transformProduct(rawSource, 'https://brooklynmuseum.org');
    expect(result).toEqual(expected);
  });
});
