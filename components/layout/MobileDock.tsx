
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

  const NavItem = ({ icon: Icon, label, onClick, badge }: { icon: any, label: string, onClick: () => void, badge?: number }) => (
    <button 
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center gap-1 py-1 group active:scale-95 transition-transform"
    >
      <div className="relative">
        <Icon 
          size={20} 
          strokeWidth={1.5} 
          className="text-gray-600 group-hover:text-black transition-colors" 
        />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-[2px] border-white shadow-sm">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[9px] font-medium tracking-tight text-gray-600 group-hover:text-black transition-colors leading-none">
        {label}
      </span>
    </button>
  );

  return (
    <div className="fixed bottom-2 inset-x-0 z-50 flex justify-center pointer-events-none md:hidden animate-slide-up">
      <div className="pointer-events-auto bg-white/75 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-2xl px-6 py-2.5 flex items-center justify-between w-[94%] max-w-[380px]">
        
        <NavItem 
          icon={Home} 
          label="Home" 
          onClick={scrollToTop} 
        />

        <NavItem 
          icon={LayoutGrid} 
          label="Shop" 
          onClick={scrollToCollection} 
        />

        <NavItem 
          icon={ShoppingBag} 
          label="Cart" 
          onClick={onOpenCart}
          badge={cartCount}
        />

        <NavItem 
          icon={Menu} 
          label="Menu" 
          onClick={onOpenMenu} 
        />

      </div>
    </div>
  );
};

export default MobileDock;
