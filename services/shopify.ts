import { ApiConfig, ShopifyCollection, ShopifyProduct } from '../types/index';
import { MOCK_COLLECTIONS } from '../config/constants';

const SHOPIFY_COLLECTIONS_QUERY = `
  query Collections {
    collections(first: 5) {
      edges {
        node {
          id
          title
          products(first: 8) {
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
      }
    }
  }
`;

export const fetchShopifyCollections = async (config: ApiConfig): Promise<{ collections: ShopifyCollection[], isMock: boolean, error?: string }> => {
  const { domain, accessToken, isStorefrontToken } = config;
  
  const shopDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  const endpoint = isStorefrontToken 
    ? `https://${shopDomain}/api/2024-01/graphql.json` 
    : `https://${shopDomain}/admin/api/2024-01/graphql.json`;

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
      body: JSON.stringify({ query: SHOPIFY_COLLECTIONS_QUERY }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    
    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    const collections = json.data?.collections?.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      products: edge.node.products.edges.map((pEdge: any) => pEdge.node)
    })) || [];

    // Filter out empty collections for cleaner UI
    const validCollections = collections.filter((c: ShopifyCollection) => c.products.length > 0);

    return { collections: validCollections, isMock: false };

  } catch (err: any) {
    console.error("Shopify Fetch Error:", err);
    return { 
      collections: MOCK_COLLECTIONS, 
      isMock: true,
      error: err.message || "Unknown Error"
    };
  }
};