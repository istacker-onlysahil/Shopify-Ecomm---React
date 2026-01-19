
import React from 'react';
import { Star } from 'lucide-react';
import { Reveal } from '../../components/ui/Reveal';
import { ShopifyImage } from '../../components/ui/ShopifyImage';

const ReviewsSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-gray-50 border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <Reveal>
          <div className="text-center mb-16 md:mb-24">
            <div className="flex justify-center gap-1 mb-4 text-accent">
               {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-medium text-gray-900 mb-4">
              Trusted by Tastemakers
            </h2>
            <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">
              Over 12,000+ 5-Star Reviews
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
           {/* Review Card 1 */}
           <Reveal delay={100}>
             <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
               <p className="text-lg text-gray-800 font-medium italic mb-8 leading-relaxed">
                 "The quality of the fabric is unmatched. I've worn the 'Azure Spice' jacket daily for a month and it still looks brand new. Absolutely worth the investment."
               </p>
               <div className="mt-auto flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    <ShopifyImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Sarah J." sizes="50px" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Sarah Jenkins</h4>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Verified Buyer</p>
                  </div>
               </div>
             </div>
           </Reveal>

           {/* Review Card 2 */}
           <Reveal delay={200}>
             <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow h-full flex flex-col md:-translate-y-8">
               <p className="text-lg text-gray-800 font-medium italic mb-8 leading-relaxed">
                 "Finally, a brand that understands modern sizing. The fit is tailored yet comfortable. Customer service was incredibly helpful when I needed to exchange."
               </p>
               <div className="mt-auto flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    <ShopifyImage src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Michael C." sizes="50px" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Michael Chen</h4>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Verified Buyer</p>
                  </div>
               </div>
             </div>
           </Reveal>

           {/* Review Card 3 */}
           <Reveal delay={300}>
             <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
               <p className="text-lg text-gray-800 font-medium italic mb-8 leading-relaxed">
                 "I was hesitant to order online, but the free returns policy gave me confidence. I ended up keeping everything! The packaging was also eco-friendly which I love."
               </p>
               <div className="mt-auto flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    <ShopifyImage src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Elena R." sizes="50px" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Elena Rodriguez</h4>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Verified Buyer</p>
                  </div>
               </div>
             </div>
           </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
