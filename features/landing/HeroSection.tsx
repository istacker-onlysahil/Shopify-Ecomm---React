
import React from 'react';
import { ArrowRight, MoveRight } from 'lucide-react';
import { Reveal } from '../../components/ui/Reveal';
import { ShopifyImage } from '../../components/ui/ShopifyImage';

const HeroSection: React.FC = () => {
  const navigateToCollection = (handle: string = 'new-arrivals') => {
    window.location.hash = `#collection/${handle}`;
  };

  return (
    <div className="pt-2 md:pt-4 pb-8 md:pb-16 max-w-[1440px] mx-auto px-2 md:px-6">
      
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 h-auto md:h-[600px] lg:h-[700px]">
        
        {/* Main Hero Block - Spans full on mobile, 8 cols on desktop */}
        <div className="md:col-span-8 relative group rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-gray-100 min-h-[500px] md:min-h-full">
            <ShopifyImage 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop" 
              alt="Summer Campaign" 
              priority={true}
              sizes="(max-width: 768px) 100vw, 66vw"
              className="w-full h-full object-cover object-[center_30%] transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-white">
                <div className="max-w-xl animate-fade-in-up">
                  <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                    SS25 Collection
                  </span>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium leading-[1.1] mb-6 tracking-tight">
                    Redefining <br/> <span className="italic">Modern Elegance</span>
                  </h1>
                  <p className="hidden md:block text-base text-white/90 mb-8 max-w-sm font-light leading-relaxed">
                    Explore a curation of pieces designed to elevate your everyday moments into something extraordinary.
                  </p>
                  
                  <button 
                    onClick={() => navigateToCollection('new-arrivals')}
                    className="group bg-white text-black pl-6 pr-5 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-3 transition-all hover:bg-gray-100 hover:scale-105"
                  >
                    Shop Collection 
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
            </div>
        </div>

        {/* Secondary Column - Spans 4 cols on desktop, hidden/stacked on mobile */}
        <div className="md:col-span-4 flex flex-col gap-2 md:gap-4">
            
            {/* Top Right Block */}
            <div 
              onClick={() => navigateToCollection('fragrances')}
              className="relative flex-1 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group cursor-pointer min-h-[250px]"
            >
                <ShopifyImage 
                  src="https://images.unsplash.com/photo-1595867252085-b162fb5244be?q=80&w=800&auto=format&fit=crop" 
                  alt="Accessories" 
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    <div className="self-end bg-white/90 backdrop-blur text-black p-2 rounded-full">
                       <MoveRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-medium mb-1">Fragrances</h3>
                      <p className="text-xs text-white/80">Essence of Luxury</p>
                    </div>
                </div>
            </div>

            {/* Bottom Right Block */}
            <div 
               onClick={() => navigateToCollection('new-arrivals')}
               className="relative flex-1 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group cursor-pointer min-h-[250px]"
            >
                <ShopifyImage 
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop" 
                  alt="New Arrivals" 
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    <div className="self-end bg-white/90 backdrop-blur text-black p-2 rounded-full">
                       <MoveRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-medium mb-1">New Arrivals</h3>
                      <p className="text-xs text-white/80">Fresh for the Season</p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;
