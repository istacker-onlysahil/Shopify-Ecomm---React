
import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ChevronDown, LayoutGrid, List, ArrowLeft, Search, Check } from 'lucide-react';
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

  // Blinkit Style: Density Control
  const [columns, setColumns] = useState<2 | 3>(3); // 3 columns for mobile density

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
      {/* Sticky Mobile Sub-Header (Quick Switch) */}
      <div className="sticky top-14 md:top-20 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 py-2 md:py-3 animate-fade-in">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center gap-3 overflow-x-auto no-scrollbar">
           <button 
             onClick={onBack}
             className="flex-shrink-0 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
           >
             <ArrowLeft size={16} />
           </button>
           <div className="h-6 w-px bg-gray-200 flex-shrink-0" />
           {allCollections.map(col => (
             <button
               key={col.id}
               onClick={() => {
                 if(col.handle !== collection.handle) {
                   window.location.hash = `#collection/${col.handle}`;
                 }
               }}
               className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                 col.id === collection.id ? 'bg-black text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
               }`}
             >
               {col.title}
             </button>
           ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-6 md:pt-10">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">{collection.title}</h1>
            <p className="text-sm text-gray-500 font-medium">{filteredProducts.length} items discovered</p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* Density Selector */}
            <div className="bg-gray-50 p-1 rounded-lg flex items-center md:hidden mr-2">
              <button 
                onClick={() => setColumns(2)}
                className={`p-1.5 rounded-md transition-all ${columns === 2 ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                onClick={() => setColumns(3)}
                className={`p-1.5 rounded-md transition-all ${columns === 3 ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
              >
                <SlidersHorizontal size={16} className="rotate-90" />
              </button>
            </div>

            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors shadow-sm"
            >
              <Filter size={14} /> Filters
            </button>

            <div className="relative group hidden md:block">
              <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors shadow-sm">
                Sort <ChevronDown size={14} />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50">
                 {[
                   { id: 'featured', label: 'Featured' },
                   { id: 'price-low-high', label: 'Price: Low to High' },
                   { id: 'price-high-low', label: 'Price: High to Low' },
                   { id: 'newest', label: 'New Arrivals' }
                 ].map(opt => (
                   <button 
                     key={opt.id}
                     onClick={() => setSortBy(opt.id as any)}
                     className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-gray-50 flex justify-between items-center"
                   >
                     {opt.label}
                     {sortBy === opt.id && <Check size={12} className="text-green-500" />}
                   </button>
                 ))}
              </div>
            </div>
          </div>
        </header>

        {/* High Density Grid */}
        <div className={`grid gap-x-2 gap-y-6 md:gap-x-6 md:gap-y-12 ${
          columns === 2 ? 'grid-cols-2' : 'grid-cols-3'
        } md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`}>
           {filteredProducts.map((product, idx) => (
             <Reveal key={product.id} delay={idx % 10 * 30}>
               <ProductCard 
                 product={product}
                 onAddToCart={onAddToCart}
                 onClick={onSelectProduct}
               />
             </Reveal>
           ))}
        </div>
      </div>

      {/* Filter Bottom Sheet (Mobile) & Sidebar (Implicit Overlay) */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" 
            onClick={() => setIsFilterOpen(false)} 
          />
          <div className="relative w-full md:max-w-md bg-white rounded-t-[2rem] md:rounded-2xl p-6 md:p-8 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-bold uppercase tracking-widest">Filters</h3>
               <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-50 rounded-full"><SlidersHorizontal size={18} /></button>
            </div>

            <div className="space-y-8">
               <div className="space-y-4">
                 <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Availability</label>
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold">In Stock Only</span>
                    <button 
                      onClick={() => setInStockOnly(!inStockOnly)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${inStockOnly ? 'bg-black' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${inStockOnly ? 'left-7' : 'left-1'}`} />
                    </button>
                 </div>
               </div>

               <div className="space-y-4">
                 <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Sort By</label>
                 <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'featured', label: 'Featured' },
                      { id: 'price-low-high', label: 'Price: Low to High' },
                      { id: 'price-high-low', label: 'Price: High to Low' },
                      { id: 'newest', label: 'New Arrivals' }
                    ].map(opt => (
                      <button 
                        key={opt.id}
                        onClick={() => setSortBy(opt.id as any)}
                        className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl border-2 transition-all ${
                          sortBy === opt.id ? 'border-black bg-black text-white shadow-lg' : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                 </div>
               </div>

               <button 
                 onClick={() => setIsFilterOpen(false)}
                 className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all"
               >
                 Show Results
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionPage;
