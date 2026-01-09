
import React from 'react';
import { Reveal } from '../../components/ui/Reveal';
import { ShopifyImage } from '../../components/ui/ShopifyImage';

const categories = [
  { name: 'New Arrivals', handle: 'new-arrivals', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600' },
  { name: 'Fragrances', handle: 'fragrances', image: 'https://whif.in/cdn/shop/files/AzureSpice_1.jpg?v=1701254321&width=600' },
  { name: 'Shoes', handle: 'new-arrivals', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600' },
  { name: 'Apparel', handle: 'new-arrivals', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600' },
];

const CategorySection: React.FC = () => {
  const navigateTo = (handle: string) => {
    window.location.hash = `#collection/${handle}`;
  };

  return (
    <section className="py-6 md:py-12 max-w-[1440px] mx-auto px-2 md:px-8">
      <Reveal>
        <div className="flex flex-row justify-between items-end mb-6 gap-4">
          <h2 className="text-xl md:text-3xl font-medium text-gray-900 pl-1">Categories</h2>
          
          <button 
            onClick={() => navigateTo('new-arrivals')}
            className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest md:hidden border-b border-gray-100 pb-0.5"
          >
              View All
          </button>

          <div className="hidden md:flex gap-3">
             <button onClick={() => navigateTo('new-arrivals')} className="bg-black text-white px-6 py-2 rounded-full text-[10px] font-semibold uppercase tracking-widest hover:scale-105 transition-all">Discover All</button>
             <button onClick={() => navigateTo('fragrances')} className="bg-white border border-gray-100 text-gray-400 px-6 py-2 rounded-full text-[10px] font-semibold uppercase tracking-widest hover:text-black hover:border-black transition-all">Fragrances</button>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-4 md:grid-cols-4 gap-3 md:gap-6">
        {categories.map((cat, idx) => (
          <Reveal key={idx} delay={idx * 50}>
            <div 
              onClick={() => navigateTo(cat.handle)}
              className="flex flex-col gap-3 cursor-pointer group"
            >
              <div className="aspect-square rounded-2xl md:rounded-[2rem] overflow-hidden bg-gray-50 relative border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md">
                  <ShopifyImage 
                    src={cat.image} 
                    alt={cat.name} 
                    sizes="(max-width: 768px) 25vw, 20vw"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
              </div>
              <span className="text-[9px] md:text-[10px] font-semibold text-center text-gray-400 uppercase tracking-[0.15em] transition-colors group-hover:text-black">
                  {cat.name}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
