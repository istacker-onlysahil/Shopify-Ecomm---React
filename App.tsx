
import React, { useState, useEffect, Suspense, lazy } from 'react';

// Types & Services
import { ShopifyProduct, ApiConfig, ToastMessage, ShopifyCollection, TransitionRect } from './types/index';
import { DEFAULT_CONFIG } from './config/constants';
import { fetchShopifyCollections } from './services/shopify';
import { useCart } from './hooks/useCart';

// UI & Layout
import Toast from './components/ui/Toast';
import Navbar from './components/layout/Navbar';
import MobileMenu from './components/layout/MobileMenu';
import MobileDock from './components/layout/MobileDock';
import { Reveal } from './components/ui/Reveal';

// Eager Loaded Features (Above the fold)
import HeroSection from './features/landing/HeroSection';
import CategorySection from './features/landing/CategorySection';
import ProductGrid from './features/products/ProductGrid';
import ProductDetail from './features/products/ProductDetail';
import ProductCard from './features/products/ProductCard';
import CartDrawer from './features/cart/CartDrawer';

// Lazy Loaded Features (Below the fold) to reduce TBT
const PromoBanner = lazy(() => import('./features/landing/PromoBanner'));
const ReviewsSection = lazy(() => import('./features/landing/ReviewsSection'));
const NewsletterSection = lazy(() => import('./features/landing/NewsletterSection'));
const Footer = lazy(() => import('./components/layout/Footer'));

const App: React.FC = () => {
  // State
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  // We need a flat list of products for the "You might also like" section
  const [flatProducts, setFlatProducts] = useState<ShopifyProduct[]>([]); 
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Selected Product & Transition State
  const [selectedProduct, setSelectedProduct] = useState<ShopifyProduct | null>(null);
  const [transitionRect, setTransitionRect] = useState<TransitionRect | null>(null);
  
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [config, setConfig] = useState<ApiConfig>(DEFAULT_CONFIG);

  // Hooks
  const { cart, addToCart: addToCartHook, removeFromCart, updateQuantity, updateVariant, cartCount } = useCart();

  // Effects
  useEffect(() => {
    loadData();
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true }); // Passive listener for scroll performance
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]); 

  // --- Browser History / Back Button Handler ---
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If the user presses the back button and we have a product open, close it.
      // We assume that if a popstate event fires, we should return to the grid view 
      // if a product is currently selected.
      if (selectedProduct) {
        setSelectedProduct(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedProduct]);

  // Handlers
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ id: Date.now().toString(), message, type });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const { collections: fetchedCollections, error } = await fetchShopifyCollections(config);
      setCollections(fetchedCollections);
      
      // Flatten products for suggested items
      const all = fetchedCollections.flatMap(c => c.products);
      // Deduplicate
      const uniqueProducts = Array.from(new Map(all.map(p => [p.id, p])).values());
      setFlatProducts(uniqueProducts);

      if (error) console.warn("Fetch warning:", error);
    } catch (e) {
      console.error(e);
      showToast("Failed to load products", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: ShopifyProduct, variantId?: string) => {
    const success = addToCartHook(product, variantId);
    if (success) {
      showToast(`Added ${product.title} to bag`, 'success');
      setCartOpen(true);
    } else {
      showToast('Could not add item', 'error');
    }
  };

  const handleMobileNav = () => {
    setMobileMenuOpen(false);
    // If a product is open when navigating via menu, just clear it
    if (selectedProduct) {
      window.history.back(); // Sync history
    } else {
      setSelectedProduct(null);
    }
  };
  
  const handleProductSelect = (product: ShopifyProduct, rect?: TransitionRect) => {
    setTransitionRect(rect || null);
    setSelectedProduct(product);
    // Push state to browser history so the "Back" button works
    window.history.pushState({ productId: product.id }, '', `#product/${product.handle}`);
  };

  const handleProductClose = () => {
    // When clicking the UI back button, we go back in history.
    // This triggers the 'popstate' event listener above, which then clears the selectedProduct.
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-black selection:text-white pb-20 md:pb-0">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <Navbar 
        isScrolled={isScrolled}
        selectedProduct={selectedProduct}
        setMobileMenuOpen={setMobileMenuOpen}
        setSelectedProduct={setSelectedProduct}
        setCartOpen={setCartOpen}
        cartCount={cartCount}
      />

      <MobileMenu 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNavigate={handleMobileNav}
      />

      {/* Mobile Floating Dock */}
      <MobileDock 
        onOpenCart={() => setCartOpen(true)}
        onOpenMenu={() => setMobileMenuOpen(true)}
        cartCount={cartCount}
      />

      <div className="relative">
        {selectedProduct ? (
          // IMPORTANT: Removed 'animate-fade-in' class to allow ProductDetail to handle its own shared element transition without opacity conflicts
          <div key="detail">
             <ProductDetail 
              product={selectedProduct} 
              originRect={transitionRect}
              onBack={handleProductClose}
              onAddToCart={handleAddToCart}
            />
          </div>
        ) : (
          <div key="landing">
            <HeroSection />
            <CategorySection />
            
            {/* Updated Grid with Collections support */}
            <ProductGrid 
              collections={collections}
              loading={loading}
              onAddToCart={handleAddToCart}
              onSelectProduct={handleProductSelect}
            />
            
            {/* Lazy Load Marketing Sections */}
            <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-black animate-spin" /></div>}>
              <PromoBanner />
              <ReviewsSection />

              {/* "You might also like" Section (Reuse Products) */}
              {flatProducts.length > 0 && (
                <section className="py-6 md:py-12 max-w-[1440px] mx-auto px-2 md:px-8">
                  <Reveal>
                    <h2 className="text-lg md:text-3xl font-medium text-gray-900 mb-4 md:mb-12 pl-1">You might also like</h2>
                  </Reveal>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-x-6 md:gap-y-10">
                    {flatProducts.slice(0, 5).map((product, idx) => (
                        <Reveal key={`like-${idx}`} delay={idx * 50}>
                          <ProductCard 
                            product={product} 
                            onAddToCart={handleAddToCart}
                            onClick={handleProductSelect}
                          />
                        </Reveal>
                    ))}
                  </div>
                </section>
              )}

              <NewsletterSection />
            </Suspense>
          </div>
        )}
      </div>

      {!selectedProduct && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}

      <CartDrawer 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        items={cart}
        onUpdateQuantity={updateQuantity}
        onUpdateVariant={updateVariant}
        onRemove={removeFromCart}
      />
    </div>
  );
};

export default App;
