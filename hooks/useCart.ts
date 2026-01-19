
import { useState, useEffect, useCallback, useMemo } from 'react';
import { CartItem, ShopifyProduct } from '../types/index';

const STORAGE_KEY = 'shopify-luxe-cart';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load cart', e);
      return [];
    }
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Persistence Effect
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // 2. Initial load flag
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // 3. Cross-tab Synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newCart = JSON.parse(e.newValue);
          setCart(newCart);
        } catch (err) {
          console.error("Error syncing cart across tabs", err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
        // Optimistic update
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

      // Check if the target variant is already in the cart
      const existingItemIndex = prev.findIndex(item => item.id === newVariantId);

      if (existingItemIndex > -1) {
        // Merge: Add old item's quantity to the existing item
        const newCart = [...prev];
        newCart[existingItemIndex] = {
           ...newCart[existingItemIndex],
           quantity: newCart[existingItemIndex].quantity + itemToUpdate.quantity
        };
        // Remove the old item
        return newCart.filter(item => item.id !== oldVariantId);
      } else {
        // Update in place
        return prev.map(item => {
          if (item.id === oldVariantId) {
            return {
              ...item,
              id: newVariantId,
              variantTitle: targetVariant.title === 'Default Title' ? '' : targetVariant.title,
              price: parseFloat(targetVariant.price.amount),
              // We keep original image or could update if variant has image
            };
          }
          return item;
        });
      }
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Memoize totals to prevent recalculation on every render
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

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
