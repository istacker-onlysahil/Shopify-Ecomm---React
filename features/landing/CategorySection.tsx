
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../../components/ui/Reveal';
import { ShopifyImage } from '../../components/ui/ShopifyImage';

const categories = [
  { name: 'Apparel', handle: 'new-arrivals', count: '42 Items', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800' },
  { name: 'Fragrances', handle: 'fragrances', count: '18 Items', image: 'https://whif.in/cdn/shop/files/AzureSpice_1.jpg?v=1701254321&width=800' },
  { name: 'Accessories', handle: 'new-arrivals', count: '24 Items', image: 'https://images.unsplash.com/photo-1509319117193-518da7277202?auto=format&fit=crop&q=80&w=800' },
  { name: 'Footwear', handle: 'new-arrivals', count: '12 Items', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800' },
];

const CategorySection: React.FC = () => {
  const navigateTo = (handle: string) => {
    window.location.hash = `#collection/${handle}`;
  };

  return (
    <section className="py-12 md:py-20 max-w-[1440px] mx-auto px-4 md:px-8">
      <Reveal>
        <div className="flex justify-between items-end mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-4xl font-serif font-medium text-gray-900 mb-2">Curated Collections</h2>
            <p className="text-gray-500 text-xs md:text-sm max-w-md">Browse our hand-picked selections for every occasion.</p>
          </div>
          <button 
            onClick={() => navigateTo('new-arrivals')}
            className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-900 hover:text-gray-600 transition-colors"
          >
              View All Collections <ArrowUpRight size={16} />
          </button>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {categories.map((cat, idx) => (
          <Reveal key={idx} delay={idx * 100}>
            <div 
              onClick={() => navigateTo(cat.handle)}
              className="group cursor-pointer relative"
            >
              <div className="aspect-[3/4] rounded-2xl md:rounded-[2rem] overflow-hidden bg-gray-100 relative mb-4">
                  <ShopifyImage 
                    src={cat.image} 
                    alt={cat.name} 
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  
                  <div className="absolute top-4 right-4 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                    <ArrowUpRight size={16} className="text-black" />
                  </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm md:text-base font-bold text-gray-900 group-hover:underline decoration-1 underline-offset-4">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  {cat.count}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
