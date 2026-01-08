
import React from 'react';
import { Reveal } from '../../components/ui/Reveal';
import { ShopifyImage } from '../../components/ui/ShopifyImage';

const categories = [
  { name: 'Shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600' },
  { name: 'Brash', image: 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?auto=format&fit=crop&q=80&w=600' },
  { name: 'Bags', image: 'https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&q=80&w=600' },
  { name: 'T-Shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600' },
];

const CategorySection: React.FC = () => {
  return (
    <section className="py-6 md:py-12 max-w-[1440px] mx-auto px-2 md:px-8">
      <Reveal>
        <div className="flex flex-row justify-between items-end mb-4 gap-4">
          <h2 className="text-lg md:text-3xl font-medium text-gray-900 pl-1">Categories</h2>
          
          <button className="text-xs font-bold text-green-600 md:hidden">
              See all
          </button>

          <div className="hidden md:flex gap-2">
             <button className="bg-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase hover:scale-105 transition-transform">All</button>
             <button className="bg-white border border-gray-200 text-gray-600 px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-gray-50 hover:border-gray-300 transition-colors">Woman</button>
             <button className="bg-white border border-gray-200 text-gray-600 px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-gray-50 hover:border-gray-300 transition-colors">Children</button>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-4 md:grid-cols-4 gap-2 md:gap-4">
        {categories.map((cat, idx) => (
          <Reveal key={idx} delay={idx * 50}>
            <div className="flex flex-col gap-1 cursor-pointer group">
              <div className="aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-gray-100 relative">
                  <ShopifyImage 
                    src={cat.image} 
                    alt={cat.name} 
                    sizes="(max-width: 768px) 25vw, 20vw"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
              </div>
              <span className="text-[10px] md:text-xs font-bold text-center text-gray-700 uppercase tracking-wide md:hidden">
                  {cat.name}
              </span>
              <div className="hidden md:block absolute bottom-4 left-4 bg-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm transition-transform group-hover:scale-105">
                {cat.name}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
