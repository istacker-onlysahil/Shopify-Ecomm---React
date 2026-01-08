
import { ApiConfig, ShopifyCollection } from '../types/index';

// Configuration for Shopify Storefront API
export const DEFAULT_CONFIG: ApiConfig = {
  domain: 'the-website-preview.myshopify.com',
  // User provided Admin Access Token
  accessToken: '8bae080f4c6605cd4fa7e4078dc491e7', 
  // Set to true for Storefront API, false for Admin API
  isStorefrontToken: true, 
};

// Mock Data Helpers
const createMockProduct = (id: string, title: string, price: string, img: string, variants: any[] = []) => ({
  id: `gid://shopify/Product/${id}`,
  title,
  description: 'A premium product for your lifestyle.',
  descriptionHtml: '<p>A premium product for your lifestyle.</p>',
  handle: title.toLowerCase().replace(/ /g, '-'),
  featuredImage: { url: img, altText: title },
  images: { edges: [{ node: { url: img, altText: title } }] },
  variants: {
    edges: variants.length > 0 ? variants : [{
      node: {
        id: `gid://shopify/ProductVariant/${id}`,
        title: 'Default',
        price: { amount: price, currencyCode: 'USD' },
        availableForSale: true
      }
    }]
  },
  priceRange: { minVariantPrice: { amount: price, currencyCode: 'USD' } }
});

// Fallback data structure updated to Collections
export const MOCK_COLLECTIONS: ShopifyCollection[] = [
  {
    id: 'mock-col-1',
    title: 'New Arrivals',
    products: [
      createMockProduct('1', 'Casual Shirt', '225.00', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800', [
        { node: { id: 'v1-s', title: 'Small', price: { amount: '225.00', currencyCode: 'USD' }, availableForSale: true } },
        { node: { id: 'v1-m', title: 'Medium', price: { amount: '235.00', currencyCode: 'USD' }, availableForSale: true } },
        { node: { id: 'v1-l', title: 'Large', price: { amount: '245.00', currencyCode: 'USD' }, availableForSale: true } }
      ]),
      createMockProduct('2', 'Chrono Watch', '125.00', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800'),
      createMockProduct('3', 'Cashmere Scarf', '125.00', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800'),
      createMockProduct('4', 'Ceramic Lamp', '125.00', 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800'),
    ]
  },
  {
    id: 'mock-col-2',
    title: 'Winter Collection',
    products: [
       createMockProduct('5', 'Premium Jacket', '125.00', 'https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&q=80&w=800'),
       createMockProduct('6', 'Hoodie Winter', '25.00', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800', [
         { node: { id: 'v6-bk', title: 'Black', price: { amount: '25.00', currencyCode: 'USD' }, availableForSale: true } },
         { node: { id: 'v6-bl', title: 'Blue', price: { amount: '25.00', currencyCode: 'USD' }, availableForSale: true } }
       ]),
    ]
  },
  {
    id: 'mock-col-3',
    title: 'Accessories',
    products: [
      createMockProduct('2', 'Chrono Watch', '125.00', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800'),
       createMockProduct('3', 'Cashmere Scarf', '125.00', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800'),
    ]
  }
];
