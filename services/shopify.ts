import { ApiConfig, ShopifyCollection, ShopifyProduct, Customer, CustomerAccessToken, AuthError } from '../types/index';
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

// --- Auth Mutations ---

const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
      }
      customerUserErrors {
        code
        message
      }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        message
      }
    }
  }
`;

const CUSTOMER_RECOVER_MUTATION = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        message
      }
    }
  }
`;

const CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
    }
  }
`;

// Helper for fetching
const shopifyFetch = async (query: string, variables: any = {}, config: ApiConfig) => {
  const { domain, accessToken, isStorefrontToken } = config;
  const shopDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  // Auth only works with Storefront API
  const endpoint = `https://${shopDomain}/api/2024-01/graphql.json`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (isStorefrontToken) {
    headers['X-Shopify-Storefront-Access-Token'] = accessToken;
  } else {
    throw new Error("Authentication requires a Storefront Access Token, not Admin.");
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return await response.json();
};

// --- Products & Collections ---

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

// --- Auth Services ---

export const createCustomer = async (config: ApiConfig, input: { email: string, password: string, firstName: string, lastName: string }) => {
  try {
    const json = await shopifyFetch(CUSTOMER_CREATE_MUTATION, { input }, config);
    if (json.data?.customerCreate?.customerUserErrors?.length > 0) {
      throw new Error(json.data.customerCreate.customerUserErrors[0].message);
    }
    return json.data?.customerCreate?.customer;
  } catch (e: any) {
    throw new Error(e.message || "Registration failed");
  }
};

export const loginCustomer = async (config: ApiConfig, input: { email: string, password: string }): Promise<CustomerAccessToken> => {
  try {
    const json = await shopifyFetch(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, { input }, config);
    
    if (json.data?.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
      throw new Error(json.data.customerAccessTokenCreate.customerUserErrors[0].message);
    }
    
    const token = json.data?.customerAccessTokenCreate?.customerAccessToken;
    if (!token) throw new Error("Could not retrieve access token");
    
    return token;
  } catch (e: any) {
    throw new Error(e.message || "Login failed");
  }
};

export const recoverCustomerPassword = async (config: ApiConfig, email: string) => {
  try {
    const json = await shopifyFetch(CUSTOMER_RECOVER_MUTATION, { email }, config);
    if (json.data?.customerRecover?.customerUserErrors?.length > 0) {
      throw new Error(json.data.customerRecover.customerUserErrors[0].message);
    }
    return true;
  } catch (e: any) {
    throw new Error(e.message || "Recovery failed");
  }
};

export const fetchCustomerData = async (config: ApiConfig, customerAccessToken: string): Promise<Customer> => {
  try {
    const json = await shopifyFetch(CUSTOMER_QUERY, { customerAccessToken }, config);
    if (!json.data?.customer) {
      throw new Error("Session expired");
    }
    return json.data.customer;
  } catch (e: any) {
    throw new Error(e.message || "Failed to fetch profile");
  }
};