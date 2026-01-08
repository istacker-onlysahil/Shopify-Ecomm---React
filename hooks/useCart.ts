
import { useState, useEffect, useCallback } from 'react';
import { CartItem, ShopifyProduct } from '../types/index';

const STORAGE_KEY = 'shopify-luxe-cart';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load cart', e);
      return [];
    }
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Persistence Effect
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Initial load flag to prevent overwriting storage with empty array on first render
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const addToCart = useCallback((product: ShopifyProduct, variantId?: string) => {
    // Determine which variant to add
    let variant = product.variants.edges[0]?.node;
    
    // If a specific variant ID is requested, try to find it
    if (variantId) {
      const found = product.variants.edges.find(e => e.node.id === variantId)?.node;
      if (found) {
        variant = found;
      }
    }

    if (!variant) return false;

    // Get all available variants to store in the cart item for later switching
    const allVariants = product.variants.edges.map(e => e.node);

    setCart(prev => {
      const existing = prev.find(item => item.id === variant.id);
      if (existing) {
        return prev.map(item => 
          item.id === variant.id ? { ...item, quantity: item.quantity + 1, variants: allVariants } : item
        );
      }
      return [...prev, {
        id: variant.id,
        productId: product.id,
        title: product.title,
        variantTitle: variant.title === 'Default Title' ? '' : variant.title,
        price: parseFloat(variant.price.amount),
        currency: variant.price.currencyCode,
        image: product.featuredImage?.url || '',
        quantity: 1,
        variants: allVariants
      }];
    });
    return true;
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  }, []);

  const updateVariant = useCallback((oldVariantId: string, newVariantId: string) => {
    setCart(prev => {
      const itemToUpdate = prev.find(item => item.id === oldVariantId);
      if (!itemToUpdate || !itemToUpdate.variants) return prev;

      const targetVariant = itemToUpdate.variants.find(v => v.id === newVariantId);
      if (!targetVariant) return prev;

      // Check if the target variant is already in the cart as a separate item
      const existingItemIndex = prev.findIndex(item => item.id === newVariantId);

      if (existingItemIndex > -1) {
        // Merge quantities: Add old item's quantity to the existing item
        const newCart = [...prev];
        newCart[existingItemIndex] = {
           ...newCart[existingItemIndex],
           quantity: newCart[existingItemIndex].quantity + itemToUpdate.quantity
        };
        // Remove the old item
        return newCart.filter(item => item.id !== oldVariantId);
      } else {
        // Update the current item details in place
        return prev.map(item => {
          if (item.id === oldVariantId) {
            return {
              ...item,
              id: newVariantId,
              variantTitle: targetVariant.title === 'Default Title' ? '' : targetVariant.title,
              price: parseFloat(targetVariant.price.amount),
              // Note: We keep the original image as our simplified variant type doesn't include images
            };
          }
          return item;
        });
      }
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateVariant,
    clearCart,
    cartTotal,
    cartCount
  };
};
