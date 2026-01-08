
import React from 'react';
import { X, ChevronRight, Instagram, Twitter, Facebook } from 'lucide-react';
import { ShopifyImage } from '../ui/ShopifyImage';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onNavigate }) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Menu Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[60] transform transition-transform duration-300 ease-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-5 flex items-center justify-between border-b border-gray-100">
           <span className="font-serif text-2xl font-bold tracking-tight">Nextgen.</span>
           <button 
             onClick={onClose} 
             className="p-2 -mr-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
           >
             <X size={24} strokeWidth={1.5} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Featured Banner */}
          <div className="p-5 pb-2">
            <div className="relative aspect-[2/1] rounded-xl overflow-hidden mb-6">
              <ShopifyImage 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600" 
                alt="New Collection" 
                sizes="350px"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-xs font-bold uppercase tracking-wider mb-1">New In</p>
                <h3 className="font-serif text-xl">Summer 2025</h3>
              </div>
            </div>
          </div>

          <nav className="px-5 space-y-1">
            {['New Arrivals', 'Shop All', 'Best Sellers', 'Men', 'Women', 'Accessories', 'Journal'].map((item) => (
              <button 
                key={item}
                onClick={onNavigate} 
                className="flex items-center justify-between w-full py-4 border-b border-gray-50 text-left group"
              >
                <span className="text-xl font-medium text-gray-900 group-hover:pl-2 transition-all duration-300">{item}</span>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-black transition-colors" />
              </button>
            ))}
          </nav>
          
          <div className="p-5 mt-4 space-y-4">
             <button className="w-full py-3 border border-gray-200 rounded-full font-bold text-sm uppercase tracking-wide hover:border-black hover:bg-black hover:text-white transition-all">
               Login / Register
             </button>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100">
           <div className="flex justify-center gap-6 text-gray-400">
              <a href="#" className="hover:text-black transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-black transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-black transition-colors"><Facebook size={20} /></a>
           </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
