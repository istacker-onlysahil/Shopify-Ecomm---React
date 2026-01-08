
import React from 'react';
import { Home, LayoutGrid, ShoppingBag, Menu } from 'lucide-react';

interface MobileDockProps {
  onOpenCart: () => void;
  onOpenMenu: () => void;
  cartCount: number;
}

const MobileDock: React.FC<MobileDockProps> = ({ onOpenCart, onOpenMenu, cartCount }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCollection = () => {
    const element = document.getElementById('collection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed bottom-4 inset-x-0 z-50 flex justify-center pointer-events-none md:hidden animate-slide-up">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl px-6 py-3 flex items-center gap-8 text-gray-500 min-w-[300px] justify-between transition-all duration-300">
        
        {/* Home */}
        <button 
          onClick={scrollToTop}
          className="flex flex-col items-center gap-1 hover:text-black transition-colors group py-1"
        >
          <Home size={22} strokeWidth={1.5} className="group-active:scale-90 transition-transform" />
        </button>

        {/* Collections */}
        <button 
          onClick={scrollToCollection}
          className="flex flex-col items-center gap-1 hover:text-black transition-colors group py-1"
        >
          <LayoutGrid size={22} strokeWidth={1.5} className="group-active:scale-90 transition-transform" />
        </button>

        {/* Cart - Floating Action Button Style */}
        <button 
          onClick={onOpenCart}
          className="relative flex flex-col items-center gap-1 group -mt-8"
        >
          <div className="bg-black text-white p-3.5 rounded-2xl shadow-xl shadow-black/20 group-active:scale-95 transition-transform relative border-[4px] border-white">
            <ShoppingBag size={20} strokeWidth={2} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                {cartCount}
              </span>
            )}
          </div>
        </button>

        {/* Menu */}
        <button 
          onClick={onOpenMenu}
          className="flex flex-col items-center gap-1 hover:text-black transition-colors group py-1"
        >
          <Menu size={22} strokeWidth={1.5} className="group-active:scale-90 transition-transform" />
        </button>

      </div>
    </div>
  );
};

export default MobileDock;
