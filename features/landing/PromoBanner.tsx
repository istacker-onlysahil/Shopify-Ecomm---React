
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../../components/ui/Reveal';
import { ShopifyImage } from '../../components/ui/ShopifyImage';

const PromoBanner: React.FC = () => {
  return (
    <section className="py-12 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative rounded-[2.5rem] overflow-hidden bg-purple-900 h-[300px] md:h-[400px] flex items-center justify-center text-center px-4 shadow-xl">
          <div className="absolute inset-0 w-full h-full">
            <ShopifyImage 
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=2000" 
              alt="Exclusive Offers" 
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="w-full h-full object-cover mix-blend-overlay opacity-60 transition-transform duration-1000 hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-block px-4 py-1 rounded-full border border-white/30 text-white text-[10px] uppercase tracking-widest mb-6 backdrop-blur-md animate-fade-in-up">
              Offers
            </div>
            <h2 className="text-3xl md:text-5xl font-medium text-white mb-8 leading-tight drop-shadow-md">
              EXCLUSIVE FASHION OFFERS <br /> AWAIT FOR YOUR
            </h2>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wide inline-flex items-center gap-2 hover:bg-gray-100 hover:scale-105 transition-all shadow-lg">
              Check It Now <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default PromoBanner;
