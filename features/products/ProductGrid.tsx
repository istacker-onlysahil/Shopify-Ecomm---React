
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ShopifyCollection, ShopifyProduct } from '../../types/index';
import ProductCard from './ProductCard';
import { Reveal } from '../../components/ui/Reveal';

interface ProductGridProps {
  collections: ShopifyCollection[];
  loading: boolean;
  onAddToCart: (product: ShopifyProduct, variantId?: string) => void;
  onSelectProduct: (product: ShopifyProduct) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ collections, loading, onAddToCart, onSelectProduct }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [displayedProducts, setDisplayedProducts] = useState<ShopifyProduct[]>([]);

  // Calculate "All" products (deduplicated)
  const allProducts = React.useMemo(() => {
    const map = new Map();
    collections.forEach(col => {
      col.products.forEach(prod => {
        if (!map.has(prod.id)) {
          map.set(prod.id, prod);
        }
      });
    });
    return Array.from(map.values());
  }, [collections]);

  useEffect(() => {
    if (activeTab === 'all') {
      setDisplayedProducts(allProducts);
    } else {
      const selectedCollection = collections.find(c => c.id === activeTab);
      setDisplayedProducts(selectedCollection ? selectedCollection.products : []);
    }
  }, [activeTab, collections, allProducts]);

  return (
    <section id="collection" className="max-w-[1440px] mx-auto px-2 md:px-8 py-4 md:py-12">
      <Reveal>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-8 gap-3">
          <h2 className="text-lg md:text-3xl font-medium text-gray-900 self-start md:self-auto pl-1">Popular products</h2>
          
          {/* Dynamic Tabs - Scrollable on mobile */}
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <div className="flex md:flex-wrap gap-2 self-start md:self-auto whitespace-nowrap px-1">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase transition-all duration-300 flex-shrink-0 ${
                    activeTab === 'all' 
                    ? 'bg-black text-white shadow-md transform scale-105' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              
              {collections.map((collection) => (
                 <button 
                    key={collection.id}
                    onClick={() => setActiveTab(collection.id)}
                    className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase transition-all duration-300 flex-shrink-0 ${
                        activeTab === collection.id 
                        ? 'bg-black text-white shadow-md transform scale-105' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                 >
                    {collection.title}
                 </button>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 md:py-32">
          <Loader2 className="w-8 h-8 md:w-12 md:h-12 animate-spin text-gray-300 mb-4" />
          <p className="text-xs md:text-base text-gray-500 font-medium animate-pulse tracking-wide">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-x-6 md:gap-y-10 min-h-[400px]">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product, index) => (
              <Reveal 
                key={`${activeTab}-${product.id}`} 
                delay={(index % 5) * 50} // Stagger effect resets every row approx
              >
                <ProductCard 
                  product={product} 
                  onAddToCart={onAddToCart} 
                  onClick={onSelectProduct}
                />
              </Reveal>
            ))
          ) : (
             <div className="col-span-full text-center py-12 text-gray-400 text-sm">
                No products found.
             </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
