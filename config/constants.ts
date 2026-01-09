
import { ApiConfig, ShopifyCollection } from '../types/index';

// Configuration for Shopify Storefront or Admin API
export const DEFAULT_CONFIG: ApiConfig = {
  domain: 'the-website-preview.myshopify.com',
  // User provided Admin Access Token
  accessToken: '8bae080f4c6605cd4fa7e4078dc491e7', 
  // Set to true for Admin API context (shpat_ or private tokens)
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
    handle: 'new-arrivals',
    products: [
      createMockProduct('1', 'Sable Journey', '4200', 'https://whif.in/cdn/shop/files/SableJourney_1.jpg?v=1701254321&width=800'),
      createMockProduct('2', 'Azure Spice', '4200', 'https://whif.in/cdn/shop/files/AzureSpice_1.jpg?v=1701254321&width=800'),
      createMockProduct('3', 'Sky Zest', '4200', 'https://whif.in/cdn/shop/files/SkyZest_1.jpg?v=1701254321&width=800'),
      createMockProduct('4', 'Creme Inferno', '4200', 'https://whif.in/cdn/shop/files/CremeInferno_1.jpg?v=1701254321&width=800'),
      createMockProduct('5', 'Ocean Rush', '4200', 'https://whif.in/cdn/shop/files/OceanRush_1.jpg?v=1701254321&width=800'),
      createMockProduct('6', 'Fresh Haze', '4200', 'https://whif.in/cdn/shop/files/FreshHaze_1.jpg?v=1701254321&width=800'),
    ]
  },
  {
    id: 'mock-col-2',
    title: 'Fragrances',
    handle: 'fragrances',
    products: [
       createMockProduct('7', 'Premium Jacket', '125.00', 'https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&q=80&w=800'),
       createMockProduct('8', 'Hoodie Winter', '25.00', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'),
    ]
  }
];
