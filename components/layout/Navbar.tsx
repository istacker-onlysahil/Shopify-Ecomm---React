
import React, { useState, useEffect } from 'react';
import { Search, Menu, User } from 'lucide-react';
import { CustomCartIcon } from '../icons/CustomCartIcon';

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
                className="lg:hidden p-2 -ml-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
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
                  className="w-0 group-hover:w-48 focus:w-48 transition-all duration-300 border-b border-gray-300 focus:border-black bg-transparent py-1 px-2 text-sm outline-none placeholder:text-gray-400"
                />
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-900">
                  <Search size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Mobile Search Toggle */}
              <button 
                className="md:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-full"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search size={20} strokeWidth={1.5} />
              </button>

              {/* Account (Desktop) */}
              <button className="hidden md:block p-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <User size={20} strokeWidth={1.5} />
              </button>

              {/* Cart */}
              <button 
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors group"
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
