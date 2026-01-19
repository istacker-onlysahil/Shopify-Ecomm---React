
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../../components/ui/Reveal';
import { ShopifyImage } from '../../components/ui/ShopifyImage';

const PromoBanner: React.FC = () => {
  return (
    <section className="py-8 md:py-20 w-full px-2 md:px-6">
      <Reveal>
        <div className="relative w-full max-w-[1440px] mx-auto h-[450px] md:h-[600px] rounded-[2rem] overflow-hidden group">
          {/* Background Image */}
          <div className="absolute inset-0">
            <ShopifyImage 
              src="https://images.unsplash.com/photo-1485230946086-1d99d529a763?auto=format&fit=crop&q=80&w=2000" 
              alt="Editorial Campaign" 
              sizes="100vw"
              className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
            />
          </div>
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-black/60 md:to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end md:justify-center p-8 md:p-20 text-white">
            <div className="max-w-2xl transform transition-transform duration-700 translate-y-4 group-hover:translate-y-0">
              <span className="inline-block px-3 py-1 mb-6 text-[10px] font-bold uppercase tracking-[0.2em] border border-white/30 rounded-full backdrop-blur-sm">
                Limited Edition
              </span>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium mb-6 leading-[1.1]">
                The Monochrome <br/> <span className="italic font-light">Series.</span>
              </h2>
              <p className="text-sm md:text-lg text-white/90 mb-10 max-w-md font-light leading-relaxed">
                A capsule collection defined by sharp contrasts and timeless silhouettes. Experience the new standard of bold.
              </p>
              
              <button className="bg-white text-black px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-3 hover:bg-gray-100 transition-colors">
                Explore The Edit <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default PromoBanner;
