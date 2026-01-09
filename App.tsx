
import React, { useState, useEffect, Suspense, lazy } from 'react';

// Types & Services
import { ShopifyProduct, ApiConfig, ToastMessage, ShopifyCollection, TransitionRect } from './types/index';
import { DEFAULT_CONFIG } from './config/constants';
import { fetchShopifyCollections } from './services/shopify';
import { useCart } from './hooks/useCart';
import { AuthProvider } from './contexts/AuthContext';

// UI & Layout
import Toast from './components/ui/Toast';
import Navbar from './components/layout/Navbar';
import MobileMenu from './components/layout/MobileMenu';
import MobileDock from './components/layout/MobileDock';
import { Reveal } from './components/ui/Reveal';
import AuthModal from './components/auth/AuthModal';
import NotFound from './features/error/NotFound';

// Eager Loaded Features (Above the fold)
import HeroSection from './features/landing/HeroSection';
import CategorySection from './features/landing/CategorySection';
import ProductGrid from './features/products/ProductGrid';
import ProductDetail from './features/products/ProductDetail';
import ProductCard from './features/products/ProductCard';
import CartDrawer from './features/cart/CartDrawer';
import CollectionPage from './features/collections/CollectionPage';

// Lazy Loaded Features (Below the fold) to reduce TBT
const PromoBanner = lazy(() => import('./features/landing/PromoBanner'));
const ReviewsSection = lazy(() => import('./features/landing/ReviewsSection'));
const NewsletterSection = lazy(() => import('./features/landing/NewsletterSection'));
const Footer = lazy(() => import('./components/layout/Footer'));

const StorefrontApp: React.FC = () => {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [flatProducts, setFlatProducts] = useState<ShopifyProduct[]>([]); 
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Selected Product & Transition State
  const [selectedProduct, setSelectedProduct] = useState<ShopifyProduct | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<ShopifyCollection | null>(null);
  const [transitionRect, setTransitionRect] = useState<TransitionRect | null>(null);
  const [is404, setIs404] = useState(false);
  
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [config, setConfig] = useState<ApiConfig>(DEFAULT_CONFIG);

  const { cart, addToCart: addToCartHook, removeFromCart, updateQuantity, updateVariant, cartCount } = useCart();

  // Load Data
  useEffect(() => {
    loadData();
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [config]);

  // Route Handling logic
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      
      if (!hash || hash === '' || hash === '#') {
        setSelectedProduct(null);
        setSelectedCollection(null);
        setIs404(false);
        return;
      }

      if (hash.startsWith('#product/')) {
        const handle = hash.replace('#product/', '');
        const found = flatProducts.find(p => p.handle === handle);
        if (found) {
          setSelectedProduct(found);
          setSelectedCollection(null);
          setIs404(false);
        } else if (flatProducts.length > 0) {
          setIs404(true);
          setSelectedProduct(null);
          setSelectedCollection(null);
        }
      } else if (hash.startsWith('#collection/')) {
        const handle = hash.replace('#collection/', '');
        const found = collections.find(c => c.handle === handle);
        if (found) {
          setSelectedCollection(found);
          setSelectedProduct(null);
          setIs404(false);
        } else if (collections.length > 0) {
          setIs404(true);
          setSelectedCollection(null);
          setSelectedProduct(null);
        }
      } else if (!hash.startsWith('#collection') && !hash.startsWith('#main-content')) {
        setIs404(true);
        setSelectedProduct(null);
        setSelectedCollection(null);
      }
    };

    window.addEventListener('popstate', handleHashChange);
    handleHashChange(); 

    return () => window.removeEventListener('popstate', handleHashChange);
  }, [flatProducts, collections]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ id: Date.now().toString(), message, type });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const { collections: fetchedCollections, error } = await fetchShopifyCollections(config);
      setCollections(fetchedCollections);
      
      const all = fetchedCollections.flatMap(c => c.products);
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
    }
  };

  const handleProductSelect = (product: ShopifyProduct, rect?: TransitionRect) => {
    if (!product) {
      window.location.hash = '';
      setSelectedProduct(null);
      setSelectedCollection(null);
      setIs404(false);
      return;
    }
    setTransitionRect(rect || null);
    setSelectedProduct(product);
    setSelectedCollection(null);
    setIs404(false);
    window.location.hash = `#product/${product.handle}`;
  };

  const handleBackToHome = () => {
    window.location.hash = '';
    setSelectedProduct(null);
    setSelectedCollection(null);
    setIs404(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-black selection:text-white pb-20 md:pb-0">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <AuthModal showToast={showToast} />

      <Navbar 
        isScrolled={isScrolled}
        selectedProduct={selectedProduct}
        collections={collections}
        setMobileMenuOpen={setMobileMenuOpen}
        onSelectProduct={handleProductSelect}
        setCartOpen={setCartOpen}
        cartCount={cartCount}
      />

      <MobileMenu 
        isOpen={mobileMenuOpen}
        collections={collections}
        onClose={() => setMobileMenuOpen(false)}
        onNavigate={() => setMobileMenuOpen(false)}
      />

      <MobileDock 
        onOpenCart={() => setCartOpen(true)}
        onOpenMenu={() => setMobileMenuOpen(true)}
        cartCount={cartCount}
      />

      <main className="relative" id="main-content" role="main">
        {is404 ? (
          <NotFound onBack={handleBackToHome} />
        ) : selectedProduct ? (
          <ProductDetail 
            product={selectedProduct} 
            originRect={transitionRect}
            onBack={handleBackToHome}
            onAddToCart={handleAddToCart}
          />
        ) : selectedCollection ? (
          <CollectionPage 
            collection={selectedCollection}
            allCollections={collections}
            onBack={handleBackToHome}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleProductSelect}
          />
        ) : (
          <div key="landing">
            <HeroSection />
            <CategorySection />
            <ProductGrid 
              collections={collections}
              loading={loading}
              onAddToCart={handleAddToCart}
              onSelectProduct={handleProductSelect}
            />
            
            <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-black animate-spin" /></div>}>
              <PromoBanner />
              <ReviewsSection />

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
      </main>

      {(!selectedProduct && !is404) && (
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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <StorefrontApp />
    </AuthProvider>
  );
};

export default App;
