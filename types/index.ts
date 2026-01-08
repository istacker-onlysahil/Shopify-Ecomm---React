

export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: ShopifyPrice;
  availableForSale: boolean;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  handle: string;
  featuredImage: ShopifyImage | null;
  images: {
    edges: Array<{ node: ShopifyImage }>;
  };
  variants: {
    edges: Array<{ node: ShopifyVariant }>;
  };
  priceRange: {
    minVariantPrice: ShopifyPrice;
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  products: ShopifyProduct[];
}

export interface CartItem {
  id: string; // Variant ID
  productId: string;
  title: string;
  variantTitle: string;
  price: number;
  currency: string;
  image: string;
  quantity: number;
  variants?: ShopifyVariant[]; // Available variants for this product
}

export interface ApiConfig {
  domain: string;
  accessToken: string;
  isStorefrontToken: boolean; // True = Storefront API, False = Admin API
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export interface TransitionRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

// --- Auth Types ---

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

export interface AuthError {
  message: string;
  code?: string;
}