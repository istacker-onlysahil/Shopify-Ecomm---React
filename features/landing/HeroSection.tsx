
import React from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="pt-6 md:pt-10 pb-4 md:pb-12 max-w-[1440px] mx-auto px-2 md:px-8 space-y-3 md:space-y-6">
      
      {/* Main Hero Banner */}
      <div className="relative w-full aspect-[2/1] md:aspect-[21/9] rounded-xl md:rounded-[2rem] overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2000" 
          alt="Summer Arrival" 
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#598ca8]/90 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute inset-0 flex flex-col justify-center items-start text-left md:items-center md:text-center text-white p-6 md:p-12">
          <h1 className="text-2xl md:text-6xl lg:text-7xl font-medium mb-2 md:mb-4 tracking-tight leading-tight">
            Summer <br className="md:hidden"/> Arrival
          </h1>
          <p className="text-xs md:text-lg max-w-xl text-white/90 mb-4 md:mb-8 font-light hidden md:block">
            Discover quality fashion that reflects your style and makes everyday enjoyable.
          </p>
          <button className="bg-white text-black px-4 py-2 md:px-8 md:py-3 rounded-full text-[10px] md:text-sm font-bold tracking-wide uppercase flex items-center gap-2 hover:bg-gray-100 transition-colors">
            Shop Now <ArrowRight size={12} className="md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {/* Sub Banners Grid - Hidden on mobile to save space or Stacked */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card */}
        <div className="relative h-[300px] md:h-[350px] rounded-[2rem] overflow-hidden bg-[#faecc9] group flex items-center">
            <div className="w-1/2 p-8 md:p-10 z-10">
                <h3 className="text-2xl md:text-3xl text-gray-900 font-medium leading-tight mb-6">
                    Where dreams meet couture
                </h3>
                <button className="bg-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide hover:shadow-lg transition-all shadow-sm text-gray-900">
                    Shop Now
                </button>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-3/5">
                 <img 
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" 
                  alt="Dreams meet couture" 
                  className="w-full h-full object-cover object-center mask-image-gradient"
                />
            </div>
        </div>

        {/* Right Card */}
         <div className="relative h-[300px] md:h-[350px] rounded-[2rem] overflow-hidden bg-[#fddfe7] group flex items-center">
            <div className="w-1/2 p-8 md:p-10 z-10">
                <h3 className="text-2xl md:text-3xl text-gray-900 font-medium leading-tight mb-6">
                    Enchanting styles for every women
                </h3>
                <button className="bg-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide hover:shadow-lg transition-all shadow-sm text-gray-900">
                    Shop Now
                </button>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-3/5">
                 <img 
                  src="https://images.unsplash.com/photo-1550614000-4b9519e49052?auto=format&fit=crop&q=80&w=800" 
                  alt="Enchanting styles" 
                  className="w-full h-full object-cover object-center"
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
