
import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { Reveal } from '../../components/ui/Reveal';

const NewsletterSection: React.FC = () => {
  return (
    <section className="bg-black text-white py-20 md:py-32 relative overflow-hidden">
       {/* Abstract Background Element */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
       
       <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <Reveal>
             <span className="inline-block p-3 rounded-full bg-white/10 mb-8 backdrop-blur-sm">
                <Mail size={24} />
             </span>
             <h2 className="text-3xl md:text-5xl font-serif font-medium mb-6">
                Join the Inner Circle
             </h2>
             <p className="text-gray-400 mb-10 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                Subscribe to our newsletter for early access to new drops, exclusive events, and 10% off your first order.
             </p>
             
             <form className="max-w-md mx-auto relative flex items-center">
               <input 
                 type="email" 
                 placeholder="Enter your email address" 
                 className="w-full bg-white/10 border border-white/20 rounded-full py-4 pl-6 pr-14 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/50 focus:border-white/50 transition-all hover:bg-white/15"
               />
               <button 
                type="submit"
                className="absolute right-2 top-2 bottom-2 aspect-square bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                aria-label="Subscribe"
               >
                 <ArrowRight size={18} />
               </button>
             </form>
             
             <p className="mt-6 text-[10px] text-gray-600 uppercase tracking-wider">
               No spam. Unsubscribe anytime.
             </p>
          </Reveal>
       </div>
    </section>
  );
};

export default NewsletterSection;
