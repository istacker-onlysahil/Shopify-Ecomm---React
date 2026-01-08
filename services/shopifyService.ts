import { ApiConfig, ShopifyProduct } from '../types';
import { MOCK_PRODUCTS } from '../constants';

const SHOPIFY_GRAPHQL_QUERY = `
  query Products {
    products(first: 20) {
      edges {
        node {
          id
          title
          description
          descriptionHtml
          handle
          featuredImage {
            url
            altText
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 5) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const fetchShopifyProducts = async (config: ApiConfig): Promise<{ products: ShopifyProduct[], isMock: boolean, error?: string }> => {
  const { domain, accessToken, isStorefrontToken } = config;
  
  // Clean domain just in case
  const shopDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const endpoint = `https://${shopDomain}/api/2024-01/graphql.json`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (isStorefrontToken) {
    headers['X-Shopify-Storefront-Access-Token'] = accessToken;
  } else {
    headers['X-Shopify-Access-Token'] = accessToken;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: SHOPIFY_GRAPHQL_QUERY }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    
    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    const products = json.data?.products?.edges.map((edge: any) => edge.node) || [];
    return { products, isMock: false };

  } catch (err: any) {
    console.error("Shopify Fetch Error:", err);
    
    // Fallback for CORS (Common when using Admin Tokens from browser) or Network errors
    return { 
      products: MOCK_PRODUCTS.map(e => e.node) as ShopifyProduct[], 
      isMock: true,
      error: err.message || "Unknown Error"
    };
  }
};