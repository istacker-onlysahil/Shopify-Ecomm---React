import { ApiConfig } from './types';

// WARNING: You are using an Admin Token in the browser.
// Shopify often blocks these requests via CORS policy for security.
// If data fails to load, the app will fallback to mock data automatically.

export const DEFAULT_CONFIG: ApiConfig = {
  domain: 'the-website-preview.myshopify.com',
  // User provided Admin Access Token
  accessToken: '8bae080f4c6605cd4fa7e4078dc491e7', 
  // Set to false as this is an Admin/Private token
  isStorefrontToken: true, 
};

// Fallback data in case the API fails due to CORS (likely with Admin token)
export const MOCK_PRODUCTS = [
  {
    node: {
      id: 'gid://shopify/Product/1',
      title: 'Casual Shirt',
      description: 'Handcrafted from full-grain leather, this bag features a spacious main compartment.',
      descriptionHtml: '<p>Handcrafted from full-grain leather, this bag features a spacious main compartment. Includes a detachable shoulder strap and brass hardware.</p>',
      handle: 'leather-weekender',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
        altText: 'Casual Shirt'
      },
      images: { 
        edges: [
          { node: { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800', altText: 'Front' } }
        ] 
      },
      variants: {
        edges: [
          {
            node: {
              id: 'gid://shopify/ProductVariant/1',
              title: 'Purple',
              price: { amount: '225.00', currencyCode: 'USD' },
              availableForSale: true
            }
          }
        ]
      },
      priceRange: {
        minVariantPrice: { amount: '225.00', currencyCode: 'USD' }
      }
    }
  },
  {
    node: {
      id: 'gid://shopify/Product/2',
      title: 'Multi color-Shirt',
      description: 'A sleek timepiece for the modern professional. Swiss movement.',
      descriptionHtml: '<p>A sleek timepiece for the modern professional. Features Swiss movement, sapphire crystal glass, and a genuine leather strap.</p>',
      handle: 'chrono-watch',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800',
        altText: 'Multi color-Shirt'
      },
      images: { edges: [] },
      variants: {
        edges: [
          {
            node: {
              id: 'gid://shopify/ProductVariant/2',
              title: 'Multi',
              price: { amount: '125.00', currencyCode: 'USD' },
              availableForSale: true
            }
          }
        ]
      },
      priceRange: {
        minVariantPrice: { amount: '125.00', currencyCode: 'USD' }
      }
    }
  },
  {
    node: {
      id: 'gid://shopify/Product/3',
      title: 'Modern Blesser',
      description: 'Soft, warm, and luxuriously lightweight. Perfect for all seasons.',
      descriptionHtml: '<p>Soft, warm, and luxuriously lightweight. Perfect for all seasons. Made from a premium blend of cashmere and wool.</p>',
      handle: 'cashmere-scarf',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
        altText: 'Modern Blesser'
      },
      images: { edges: [] },
      variants: {
        edges: [
          {
            node: {
              id: 'gid://shopify/ProductVariant/3',
              title: 'Beige',
              price: { amount: '125.00', currencyCode: 'USD' },
              availableForSale: true
            }
          }
        ]
      },
      priceRange: {
        minVariantPrice: { amount: '125.00', currencyCode: 'USD' }
      }
    }
  },
  {
    node: {
      id: 'gid://shopify/Product/4',
      title: 'Waterproof Jacket',
      description: 'Hand-thrown ceramic lamp with a linen shade. Adds warmth to any room.',
      descriptionHtml: '<p>Hand-thrown ceramic lamp with a linen shade. Adds warmth to any room. 60W bulb included.</p>',
      handle: 'ceramic-lamp',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800',
        altText: 'Waterproof Jacket'
      },
      images: { edges: [] },
      variants: {
        edges: [
          {
            node: {
              id: 'gid://shopify/ProductVariant/4',
              title: 'Green',
              price: { amount: '125.00', currencyCode: 'USD' },
              availableForSale: true
            }
          }
        ]
      },
      priceRange: {
        minVariantPrice: { amount: '125.00', currencyCode: 'USD' }
      }
    }
  },
  {
    node: {
      id: 'gid://shopify/Product/5',
      title: 'Premium Jacket',
      description: 'Colorful vibrant style.',
      handle: 'premium-jacket',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&q=80&w=800',
        altText: 'Premium Jacket'
      },
      images: { edges: [] },
      variants: {
        edges: [{ node: { id: 'v5', title: 'Multi', price: { amount: '125.00', currencyCode: 'USD' }, availableForSale: true } }]
      },
      priceRange: { minVariantPrice: { amount: '125.00', currencyCode: 'USD' } }
    }
  },
   {
    node: {
      id: 'gid://shopify/Product/6',
      title: 'Hoodie Winter',
      description: 'Colorful vibrant style.',
      handle: 'hoodie-winter',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
        altText: 'Hoodie Winter'
      },
      images: { edges: [] },
      variants: {
        edges: [{ node: { id: 'v6', title: 'Multi', price: { amount: '25.00', currencyCode: 'USD' }, availableForSale: true } }]
      },
      priceRange: { minVariantPrice: { amount: '25.00', currencyCode: 'USD' } }
    }
  }
];