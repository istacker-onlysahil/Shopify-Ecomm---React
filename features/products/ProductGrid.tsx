
import React, { useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { ShopifyCollection, ShopifyProduct, TransitionRect } from '../../types/index';
import ProductCard from './ProductCard';
import { Reveal } from '../../components/ui/Reveal';

interface ProductGridProps {
  collections: ShopifyCollection[];
  loading: boolean;
  onAddToCart: (product: ShopifyProduct, variantId?: string) => void;
  onSelectProduct: (product: ShopifyProduct, rect?: TransitionRect) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ collections, loading, onAddToCart, onSelectProduct }) => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const allProducts = useMemo(() => {
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

  const displayedProducts = useMemo(() => {
    if (activeTab === 'all') {
      return allProducts;
    }
    const selectedCollection = collections.find(c => c.id === activeTab);
    return selectedCollection ? selectedCollection.products : [];
  }, [activeTab, collections, allProducts]);

  return (
    <section id="collection" className="max-w-[1440px] mx-auto px-2 md:px-8 py-4 md:py-12">
      <Reveal>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-10 gap-3">
          <h2 className="text-xl md:text-3xl font-medium text-gray-900 self-start md:self-auto pl-1">Popular Discovery</h2>
          
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <div className="flex md:flex-wrap gap-2.5 self-start md:self-auto whitespace-nowrap px-1">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-5 py-2 rounded-full text-[10px] md:text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
                    activeTab === 'all' 
                    ? 'bg-black text-white shadow-lg' 
                    : 'bg-white border border-gray-100 text-gray-400 hover:text-black hover:border-black'
                }`}
              >
                All
              </button>
              
              {collections.map((collection) => (
                 <button 
                    key={collection.id}
                    onClick={() => setActiveTab(collection.id)}
                    className={`px-5 py-2 rounded-full text-[10px] md:text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
                        activeTab === collection.id 
                        ? 'bg-black text-white shadow-lg' 
                        : 'bg-white border border-gray-100 text-gray-400 hover:text-black hover:border-black'
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
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-gray-200 mb-4" />
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.2em]">Curation in progress</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-x-6 md:gap-y-12">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product, index) => (
              <Reveal 
                key={`${activeTab}-${product.id}`} 
                delay={(index % 6) * 40} 
              >
                <ProductCard 
                  product={product} 
                  onAddToCart={onAddToCart} 
                  onClick={onSelectProduct}
                />
              </Reveal>
            ))
          ) : (
             <div className="col-span-full text-center py-20 text-gray-400 text-xs font-medium uppercase tracking-widest">
                No artifacts found
             </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
