
import React, { useState, useEffect } from 'react';

// Types & Services
import { ShopifyProduct, ApiConfig, ToastMessage, ShopifyCollection } from './types/index';
import { DEFAULT_CONFIG } from './config/constants';
import { fetchShopifyCollections } from './services/shopify';
import { useCart } from './hooks/useCart';

// UI & Layout
import Toast from './components/ui/Toast';
import Navbar from './components/layout/Navbar';
import MobileMenu from './components/layout/MobileMenu';
import Footer from './components/layout/Footer';

// Features
import HeroSection from './features/landing/HeroSection';
import CategorySection from './features/landing/CategorySection';
import PromoBanner from './features/landing/PromoBanner';
import ReviewsSection from './features/landing/ReviewsSection';
import NewsletterSection from './features/landing/NewsletterSection';
import ProductGrid from './features/products/ProductGrid';
import ProductDetail from './features/products/ProductDetail';
import ProductCard from './features/products/ProductCard';
import CartDrawer from './features/cart/CartDrawer';

const App: React.FC = () => {
  // State
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  // We need a flat list of products for the "You might also like" section
  const [flatProducts, setFlatProducts] = useState<ShopifyProduct[]>([]); 
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ShopifyProduct | null>(null);
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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]); 

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setSelectedProduct(null);
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

      <div className="relative">
        {selectedProduct ? (
          <div key="detail" className="animate-fade-in">
             <ProductDetail 
              product={selectedProduct} 
              onBack={() => setSelectedProduct(null)}
              onAddToCart={handleAddToCart}
            />
          </div>
        ) : (
          <div key="landing" className="animate-fade-in">
            <HeroSection />
            <CategorySection />
            
            {/* Updated Grid with Collections support */}
            <ProductGrid 
              collections={collections}
              loading={loading}
              onAddToCart={handleAddToCart}
              onSelectProduct={setSelectedProduct}
            />
            
            <PromoBanner />
            <ReviewsSection />

            {/* "You might also like" Section (Reuse Products) */}
            {flatProducts.length > 0 && (
              <section className="py-6 md:py-12 max-w-[1440px] mx-auto px-2 md:px-8">
                <h2 className="text-lg md:text-3xl font-medium text-gray-900 mb-4 md:mb-12 pl-1">You might also like</h2>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-x-6 md:gap-y-10">
                  {flatProducts.slice(0, 5).map((product, idx) => (
                      <div key={`like-${idx}`} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                        <ProductCard 
                          product={product} 
                          onAddToCart={handleAddToCart}
                          onClick={setSelectedProduct}
                        />
                      </div>
                  ))}
                </div>
              </section>
            )}

            <NewsletterSection />
          </div>
        )}
      </div>

      {!selectedProduct && <Footer />}

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
