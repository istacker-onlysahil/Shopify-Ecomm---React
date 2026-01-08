import React from 'react';
import { ArrowRight } from 'lucide-react';

const PromoBanner: React.FC = () => {
  return (
    <section className="py-12 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-[2.5rem] overflow-hidden bg-purple-900 h-[300px] md:h-[400px] flex items-center justify-center text-center px-4">
        <img 
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=2000" 
          alt="Exclusive Offers" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-block px-4 py-1 rounded-full border border-white/30 text-white text-[10px] uppercase tracking-widest mb-6 backdrop-blur-md">
            Offers
          </div>
          <h2 className="text-3xl md:text-5xl font-medium text-white mb-8 leading-tight">
            EXCLUSIVE FASHION OFFERS <br /> AWAIT FOR YOUR
          </h2>
          <button className="bg-white text-gray-900 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wide inline-flex items-center gap-2 hover:bg-gray-100 transition-colors">
            Check It Now <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;