
import React from 'react';
import { Mail } from 'lucide-react';
import { Reveal } from '../../components/ui/Reveal';
import { ShopifyImage } from '../../components/ui/ShopifyImage';

const NewsletterSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-200 py-16 md:py-24 mt-12">
       <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative rounded-[2.5rem] overflow-hidden min-h-[400px] flex items-center shadow-2xl">
               <div className="absolute inset-0">
                  <ShopifyImage 
                    src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=2000"
                    alt="Newsletter Background"
                    sizes="(max-width: 1440px) 100vw, 1440px"
                    className="w-full h-full object-cover"
                  />
               </div>
               <div className="absolute inset-0 bg-black/30" />
               <div className="relative z-10 w-full max-w-2xl px-8 md:px-16 py-12 text-white">
                  <h2 className="text-3xl md:text-5xl font-medium leading-tight mb-8 drop-shadow-sm">
                    STAY UPTO DATE ABOUT OUR LATEST OFFERS
                  </h2>
                  
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <input 
                        type="email" 
                        placeholder="Enter your email here" 
                        className="w-full bg-white text-gray-900 rounded-full py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                    <button className="bg-white text-gray-900 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-gray-100 hover:scale-105 transition-all w-full sm:w-auto shadow-lg">
                      Subscribe to Newsletter
                    </button>
                  </div>
               </div>
            </div>
          </Reveal>
       </div>
    </section>
  );
};

export default NewsletterSection;
