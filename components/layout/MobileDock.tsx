
import React, { useState } from 'react';
import { Home, LayoutGrid, User, Search, X, ChevronRight, FolderOpen } from 'lucide-react';
import { ShopifyCollection } from '../../types/index';
import { useAuth } from '../../contexts/AuthContext';

interface MobileDockProps {
  collections: ShopifyCollection[];
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onNavigateHome: () => void;
}

const MobileDock: React.FC<MobileDockProps> = ({ 
  collections, 
  onOpenSearch, 
  onOpenAuth, 
  onNavigateHome 
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { isAuthenticated, customer } = useAuth();

  const handleNavigate = (handle: string) => {
    window.location.hash = `#collection/${handle}`;
    setIsSheetOpen(false);
  };

  const NavItem = ({ icon: Icon, label, onClick, isActive = false }: { icon: any, label: string, onClick: () => void, isActive?: boolean }) => (
    <button 
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center gap-1.5 py-1 group active:scale-95 transition-transform"
    >
      <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-black text-white' : 'text-gray-400 group-hover:text-black'}`}>
        <Icon 
          size={20} 
          strokeWidth={isActive ? 2 : 1.5} 
        />
      </div>
      <span className={`text-[10px] font-medium tracking-[0.05em] uppercase leading-none transition-colors ${isActive ? 'text-black' : 'text-gray-400'}`}>
        {label}
      </span>
    </button>
  );

  return (
    <>
      {/* Bottom Sheet for Collections */}
      {isSheetOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center md:hidden">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-fade-in" 
            onClick={() => setIsSheetOpen(false)} 
          />
          <div className="relative w-full bg-white rounded-t-[2.5rem] shadow-2xl animate-slide-up overflow-hidden max-h-[80vh] flex flex-col">
            <div className="h-1.5 w-12 bg-gray-200 rounded-full mx-auto mt-4 mb-2" />
            
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50">
               <h3 className="text-lg font-semibold uppercase tracking-widest flex items-center gap-2">
                 <FolderOpen size={18} /> Collections
               </h3>
               <button 
                 onClick={() => setIsSheetOpen(false)}
                 className="p-2 bg-gray-50 rounded-full text-gray-400"
               >
                 <X size={18} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-2">
               {collections.map((col) => (
                 <button
                   key={col.id}
                   onClick={() => handleNavigate(col.handle)}
                   className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all group"
                 >
                   <div className="flex flex-col items-start">
                     <span className="text-sm font-medium uppercase tracking-widest text-gray-900">{col.title}</span>
                     <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{col.products.length} Items</span>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:translate-x-1 transition-transform text-gray-400 group-hover:text-black">
                     <ChevronRight size={14} />
                   </div>
                 </button>
               ))}
            </div>
            
            <div className="p-6 bg-gray-50">
               <button 
                 onClick={() => handleNavigate('new-arrivals')}
                 className="w-full bg-black text-white py-4 rounded-2xl font-semibold uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all"
               >
                 View All Products
               </button>
            </div>
          </div>
        </div>
      )}

      {/* The Main Dock */}
      <div className="fixed bottom-4 inset-x-0 z-50 flex justify-center pointer-events-none md:hidden animate-slide-up">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-2xl border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.12)] rounded-[2rem] px-4 py-2 flex items-center justify-between w-[92%] max-w-[400px]">
          
          <NavItem 
            icon={Home} 
            label="Home" 
            onClick={onNavigateHome} 
          />

          <NavItem 
            icon={LayoutGrid} 
            label="Shop" 
            onClick={() => setIsSheetOpen(true)}
            isActive={isSheetOpen}
          />

          <NavItem 
            icon={User} 
            label={isAuthenticated ? (customer?.firstName || 'Account') : 'Login'} 
            onClick={onOpenAuth} 
          />

          <NavItem 
            icon={Search} 
            label="Search" 
            onClick={onOpenSearch} 
          />

        </div>
      </div>
    </>
  );
};

export default MobileDock;
