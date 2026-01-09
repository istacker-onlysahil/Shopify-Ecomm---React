
import React from 'react';
import { X, ChevronRight, Instagram, Twitter, Facebook, LogOut, User, FolderOpen } from 'lucide-react';
import { ShopifyImage } from '../ui/ShopifyImage';
import { useAuth } from '../../contexts/AuthContext';
import { ShopifyCollection } from '../../types/index';

interface MobileMenuProps {
  isOpen: boolean;
  collections?: ShopifyCollection[];
  onClose: () => void;
  onNavigate: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, collections = [], onClose, onNavigate }) => {
  const { isAuthenticated, customer, logout, setShowAuthModal, setAuthView } = useAuth();

  const handleAuthAction = () => {
    onClose();
    if (isAuthenticated) {
        logout();
    } else {
        setAuthView('login');
        setShowAuthModal(true);
    }
  };

  const navigateTo = (handle: string) => {
    window.location.hash = `#collection/${handle}`;
    onNavigate();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[60] transform transition-transform duration-300 ease-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-label="Mobile Navigation"
      >
        <div className="p-5 flex items-center justify-between border-b border-gray-100">
           <span className="font-serif text-2xl font-bold tracking-tight">Nextgen.</span>
           <button 
             onClick={onClose} 
             className="p-2 -mr-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
             aria-label="Close menu"
           >
             <X size={24} strokeWidth={1.5} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          
          {isAuthenticated && (
            <div className="p-5 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                        {customer?.firstName?.charAt(0)}{customer?.lastName?.charAt(0)}
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Welcome,</p>
                        <p className="font-bold text-gray-900">{customer?.firstName} {customer?.lastName}</p>
                    </div>
                </div>
            </div>
          )}

          <div className="px-5 py-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
              <FolderOpen size={12} /> Collections
            </h3>
            <div className="space-y-1">
              {collections.map((col) => (
                <button 
                  key={col.id}
                  onClick={() => navigateTo(col.handle)} 
                  className="flex items-center justify-between w-full py-4 border-b border-gray-50 text-left group min-h-[44px]"
                >
                  <span className="text-lg font-bold text-gray-900 group-hover:pl-2 transition-all duration-300">{col.title}</span>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-black transition-colors" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-5 mt-4 space-y-4">
             <button 
                onClick={handleAuthAction}
                className={`w-full py-3 border rounded-full font-bold text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                    isAuthenticated 
                    ? 'border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200' 
                    : 'border-gray-200 hover:border-black hover:bg-black hover:text-white'
                }`}
             >
               {isAuthenticated ? (
                   <>
                    <LogOut size={16} /> Sign Out
                   </>
               ) : (
                   'Login / Register'
               )}
             </button>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100">
           <div className="flex justify-center gap-6 text-gray-400">
              <a href="#" className="hover:text-black transition-colors p-2" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" className="hover:text-black transition-colors p-2" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" className="hover:text-black transition-colors p-2" aria-label="Facebook"><Facebook size={20} /></a>
           </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
