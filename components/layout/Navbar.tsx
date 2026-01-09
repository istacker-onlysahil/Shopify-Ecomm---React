
import React, { useState, useEffect } from 'react';
import { Search, Menu, User, LogOut } from 'lucide-react';
import { CustomCartIcon } from '../icons/CustomCartIcon';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  isScrolled: boolean;
  selectedProduct: any;
  setMobileMenuOpen: (open: boolean) => void;
  setSelectedProduct: (product: any | null) => void;
  setCartOpen: (open: boolean) => void;
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isScrolled, 
  selectedProduct,
  setMobileMenuOpen, 
  setSelectedProduct, 
  setCartOpen, 
  cartCount 
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const { isAuthenticated, customer, logout, setShowAuthModal, setAuthView } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const announcements = [
    "Free Worldwide Shipping on Orders Over $200",
    "New Summer Collection Drops this Friday",
    "Use Code WELCOME10 for 10% Off First Order"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleUserClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      setAuthView('login');
      setShowAuthModal(true);
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className={`bg-black text-white text-[10px] md:text-xs py-2 md:py-2.5 text-center font-medium tracking-widest uppercase relative z-50 overflow-hidden block`}>
        <div className="transition-transform duration-500 ease-in-out" key={announcementIndex}>
            {announcements[announcementIndex]}
        </div>
      </div>

      {/* Main Navbar - Sticky */}
      <nav 
        className={`sticky top-0 w-full z-40 transition-all duration-300 border-b ${
          isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-gray-100 py-3 md:py-3' 
          : 'bg-white/90 backdrop-blur-sm border-transparent py-3 md:py-5'
        } block`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Left: Mobile Menu & Desktop Links */}
            <div className="flex items-center gap-4 flex-1">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Open menu"
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>

              <div className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide text-gray-900">
                <button className="hover:text-gray-500 hover:underline decoration-1 underline-offset-4 transition-all">Shop</button>
                <button className="hover:text-gray-500 hover:underline decoration-1 underline-offset-4 transition-all">Collections</button>
                <button className="hover:text-gray-500 hover:underline decoration-1 underline-offset-4 transition-all">About</button>
                <button className="hover:text-gray-500 hover:underline decoration-1 underline-offset-4 transition-all">Journal</button>
              </div>
            </div>

            {/* Center: Logo */}
            <div 
              className="flex-shrink-0 cursor-pointer group text-center"
              onClick={() => {
                setSelectedProduct(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <h1 className={`font-serif font-bold text-gray-900 tracking-tight transition-all duration-300 ${isScrolled ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
                Nextgen<span className="text-gray-300">.</span>
              </h1>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center justify-end gap-1 md:gap-4 flex-1">
              {/* Desktop Search */}
              <div className="hidden md:flex items-center relative group">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  aria-label="Search products"
                  className="w-0 group-hover:w-48 focus:w-48 transition-all duration-300 border-b border-gray-300 focus:border-black bg-transparent py-1 px-2 text-sm outline-none placeholder:text-gray-400"
                />
                <button 
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-900 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Search"
                >
                  <Search size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Mobile Search Toggle */}
              <button 
                className="md:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
                onClick={() => setShowSearch(!showSearch)}
                aria-label="Toggle search"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>

              {/* Account (Desktop) */}
              <div className="relative hidden md:block">
                <button 
                  onClick={handleUserClick}
                  className={`p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 min-h-[44px] ${isAuthenticated ? 'text-black font-medium' : 'text-gray-900'}`}
                  aria-label={isAuthenticated ? "My Account" : "Login"}
                >
                  <User size={20} strokeWidth={1.5} />
                  {isAuthenticated && <span className="text-xs uppercase font-bold">{customer?.firstName}</span>}
                </button>

                {/* User Dropdown */}
                {isAuthenticated && showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 animate-scale-in origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold truncate">{customer?.email}</p>
                    </div>
                    <button 
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Cart */}
              <button 
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors group min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={`Open cart, ${cartCount} items`}
              >
                <CustomCartIcon className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 md:top-0 md:right-0 bg-black text-white text-[9px] md:text-[10px] font-bold h-3.5 w-3.5 md:h-4 md:w-4 rounded-full flex items-center justify-center ring-2 ring-white transform group-hover:scale-110 transition-transform">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar Expand */}
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showSearch ? 'max-h-16 opacity-100 mt-2' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                aria-label="Search"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                autoFocus={showSearch}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;