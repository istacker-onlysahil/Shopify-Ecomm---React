
import React, { useState, useMemo } from 'react';
import { Filter, ChevronDown, ArrowLeft, Check, X } from 'lucide-react';
import { ShopifyCollection, ShopifyProduct, TransitionRect } from '../../types/index';
import ProductCard from '../products/ProductCard';
import { Reveal } from '../../components/ui/Reveal';

interface CollectionPageProps {
  collection: ShopifyCollection;
  allCollections: ShopifyCollection[];
  onBack: () => void;
  onAddToCart: (product: ShopifyProduct, variantId?: string) => void;
  onSelectProduct: (product: ShopifyProduct, rect?: TransitionRect) => void;
}

type SortOption = 'price-low-high' | 'price-high-low' | 'newest' | 'featured';

const CollectionPage: React.FC<CollectionPageProps> = ({ 
  collection, 
  allCollections, 
  onBack, 
  onAddToCart, 
  onSelectProduct 
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    let prods = [...collection.products];

    if (inStockOnly) {
      prods = prods.filter(p => p.variants.edges.some(v => v.node.availableForSale));
    }

    if (sortBy === 'price-low-high') {
      prods.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
    } else if (sortBy === 'price-high-low') {
      prods.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
    }

    return prods;
  }, [collection.products, sortBy, inStockOnly]);

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-12">
      <div className="sticky top-14 md:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-50 py-2.5 animate-fade-in">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center gap-3 overflow-x-auto no-scrollbar">
           <button 
             onClick={onBack}
             className="flex-shrink-0 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
           >
             <ArrowLeft size={16} />
           </button>
           <div className="h-6 w-px bg-gray-100 flex-shrink-0" />
           {allCollections.map(col => (
             <button
               key={col.id}
               onClick={() => {
                 if(col.handle !== collection.handle) {
                   window.location.hash = `#collection/${col.handle}`;
                 }
               }}
               className={`flex-shrink-0 px-5 py-2 rounded-full text-[10px] md:text-xs font-semibold uppercase tracking-widest transition-all whitespace-nowrap ${
                 col.id === collection.id ? 'bg-black text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100'
               }`}
             >
               {col.title}
             </button>
           ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-6 md:pt-12">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900 leading-tight">{collection.title}</h1>
            <p className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-widest">{filteredProducts.length} DISCOVERIES</p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 bg-white border border-gray-100 hover:border-black px-5 py-2.5 rounded-full text-[10px] font-semibold uppercase tracking-widest transition-all shadow-sm"
            >
              <Filter size={14} /> Filter
            </button>

            <div className="relative group hidden md:block">
              <button className="flex items-center gap-2 bg-white border border-gray-100 hover:border-black px-5 py-2.5 rounded-full text-[10px] font-semibold uppercase tracking-widest transition-all shadow-sm">
                Sort By <ChevronDown size={14} />
              </button>
              <div className="absolute top-full right-0 mt-3 w-52 bg-white rounded-xl shadow-2xl border border-gray-50 py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0 z-50">
                 {[
                   { id: 'featured', label: 'Recommended' },
                   { id: 'price-low-high', label: 'Price: Low to High' },
                   { id: 'price-high-low', label: 'Price: High to Low' },
                   { id: 'newest', label: 'New Arrivals' }
                 ].map(opt => (
                   <button 
                     key={opt.id}
                     onClick={() => setSortBy(opt.id as any)}
                     className="w-full text-left px-5 py-3 text-[11px] font-medium uppercase tracking-wider hover:bg-gray-50 flex justify-between items-center transition-colors"
                   >
                     {opt.label}
                     {sortBy === opt.id && <Check size={12} className="text-black" />}
                   </button>
                 ))}
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2 gap-y-8 md:gap-x-6 md:gap-y-16">
           {filteredProducts.map((product, idx) => (
             <Reveal key={product.id} delay={(idx % 6) * 40}>
               <ProductCard 
                 product={product}
                 onAddToCart={onAddToCart}
                 onClick={onSelectProduct}
               />
             </Reveal>
           ))}
        </div>
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" 
            onClick={() => setIsFilterOpen(false)} 
          />
          <div className="relative w-full md:max-w-md bg-white rounded-t-[2.5rem] md:rounded-3xl p-6 md:p-10 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-gray-900">Refine Search</h3>
               <button onClick={() => setIsFilterOpen(false)} className="p-2.5 bg-gray-50 rounded-full text-gray-400 hover:text-black transition-colors"><X size={20} /></button>
            </div>

            <div className="space-y-10">
               <div className="space-y-4">
                 <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">Inventory</label>
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-sm font-medium text-gray-900">Show only available items</span>
                    <button 
                      onClick={() => setInStockOnly(!inStockOnly)}
                      className={`w-11 h-6 rounded-full relative transition-all duration-300 ${inStockOnly ? 'bg-black' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${inStockOnly ? 'left-6' : 'left-1'}`} />
                    </button>
                 </div>
               </div>

               <div className="space-y-4">
                 <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">Order By</label>
                 <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { id: 'featured', label: 'Recommended' },
                      { id: 'price-low-high', label: 'Price: Low to High' },
                      { id: 'price-high-low', label: 'Price: High to Low' },
                      { id: 'newest', label: 'New Arrivals' }
                    ].map(opt => (
                      <button 
                        key={opt.id}
                        onClick={() => setSortBy(opt.id as any)}
                        className={`w-full text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest rounded-2xl border transition-all ${
                          sortBy === opt.id ? 'border-black bg-black text-white shadow-xl' : 'border-gray-100 bg-white hover:border-gray-200 text-gray-500'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                 </div>
               </div>

               <button 
                 onClick={() => setIsFilterOpen(false)}
                 className="w-full bg-black text-white py-5 rounded-2xl font-semibold uppercase tracking-[0.2em] shadow-2xl active:scale-[0.98] transition-all mt-4"
               >
                 Apply Filters
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionPage;
