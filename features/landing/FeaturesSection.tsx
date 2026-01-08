import React from 'react';
import { Check, Loader2, ExternalLink } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  return (
    <section className="bg-white py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
              <div className="flex flex-col items-center p-4 animate-fade-in-up delay-75">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-accent transform transition-transform hover:scale-110 duration-300 ease-buttery">
                      <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">Sustainable Materials</h3>
                  <p className="text-gray-500 leading-relaxed max-w-xs text-sm">Sourced responsibly, ensuring minimal environmental impact without compromising quality.</p>
              </div>
              <div className="flex flex-col items-center p-4 animate-fade-in-up delay-100">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-accent transform transition-transform hover:scale-110 duration-300 ease-buttery">
                      <Loader2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">Artisan Craftsmanship</h3>
                  <p className="text-gray-500 leading-relaxed max-w-xs text-sm">Each piece is handcrafted by skilled artisans, making every item truly unique.</p>
              </div>
              <div className="flex flex-col items-center p-4 animate-fade-in-up delay-150">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-accent transform transition-transform hover:scale-110 duration-300 ease-buttery">
                      <ExternalLink className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">Lifetime Warranty</h3>
                  <p className="text-gray-500 leading-relaxed max-w-xs text-sm">We stand behind our products. If it breaks, we fix it. Simple as that.</p>
              </div>
          </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
