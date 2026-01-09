
import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, User, LogOut, Loader2, X, ArrowRight, ChevronDown } from 'lucide-react';
import { CustomCartIcon } from '../icons/CustomCartIcon';
import { useAuth } from '../../contexts/AuthContext';
import { searchShopifyProducts } from '../../services/shopify';
import { DEFAULT_CONFIG } from '../../config/constants';
import { ShopifyProduct, TransitionRect, ShopifyCollection } from '../../types/index';
import { ShopifyImage } from '../ui/ShopifyImage';

interface NavbarProps {
  isScrolled: boolean;
  selectedProduct: ShopifyProduct | null;
  collections?: ShopifyCollection[];
  setMobileMenuOpen: (open: boolean) => void;
  onSelectProduct: (product: ShopifyProduct, rect?: TransitionRect) => void;
  setCartOpen: (open: boolean) => void;
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isScrolled, 
  selectedProduct,
  collections = [],
  setMobileMenuOpen, 
  onSelectProduct, 
  setCartOpen, 
  cartCount 
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const { isAuthenticated, customer, logout, setShowAuthModal, setAuthView } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ShopifyProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        const results = await searchShopifyProducts(DEFAULT_CONFIG, searchQuery);
        setSearchResults(results);
        setIsSearching(false);
        setShowDropdown(true);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      setAuthView('login');
      setShowAuthModal(true);
    }
  };

  const handleProductSelect = (product: ShopifyProduct) => {
    onSelectProduct(product);
    setShowDropdown(false);
    setShowSearch(false);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCollection = (handle: string) => {
    window.location.hash = `#collection/${handle}`;
  };

  const SearchDropdown = ({ results, loading, isMobile = false }: { results: ShopifyProduct[], loading: boolean, isMobile?: boolean }) => {
    if (!showDropdown || (!results.length && !loading)) return null;

    return (
      <div className={`absolute left-0 right-0 z-[100] mt-2 overflow-hidden bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl animate-scale-in origin-top ${isMobile ? 'top-full' : 'top-full'}`}>
        <div className="p-4">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Suggestions</h4>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleProductSelect(product);
                  }}
                  className="w-full flex items-center gap-4 p-2 rounded-xl hover:bg-gray-50 transition-colors text-left group cursor-pointer"
                >
                  <div className="w-12 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                    <ShopifyImage src={product.featuredImage?.url || ''} alt="" sizes="48px" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-black transition-colors">{product.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: product.priceRange.minVariantPrice.currencyCode }).format(parseFloat(product.priceRange.minVariantPrice.amount))}
                    </p>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-center text-gray-500 py-4">No results found for "{searchQuery}"</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`bg-black text-white text-[10px] md:text-xs py-2 md:py-2.5 text-center font-medium tracking-widest uppercase relative z-50 overflow-hidden block`}>
        <div className="transition-transform duration-500 ease-in-out" key={announcementIndex}>
            {announcements[announcementIndex]}
        </div>
      </div>

      <nav 
        className={`sticky top-0 w-full z-40 transition-all duration-300 border-b ${
          isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-gray-100 py-3 md:py-3' 
          : 'bg-white/90 backdrop-blur-sm border-transparent py-3 md:py-5'
        } block`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center gap-4 flex-1">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Open menu"
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>

              <div className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide text-gray-900">
                <button 
                  onClick={() => navigateToCollection('new-arrivals')}
                  className="hover:text-gray-500 hover:underline decoration-1 underline-offset-4 transition-all"
                >
                  Shop
                </button>
                <div className="relative group h-full py-4">
                  <button className="flex items-center gap-1 hover:text-gray-500 transition-all">
                    Collections <ChevronDown size={14} />
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-0 w-56 bg-white border border-gray-100 shadow-2xl rounded-xl py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-[110]">
                     {collections.map(col => (
                       <button 
                         key={col.id}
                         onClick={() => navigateToCollection(col.handle)}
                         className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 hover:text-black transition-colors"
                       >
                         {col.title}
                       </button>
                     ))}
                  </div>
                </div>
                <button className="hover:text-gray-500 transition-all">Journal</button>
              </div>
            </div>

            <div 
              className="flex-shrink-0 cursor-pointer group text-center"
              onClick={() => {
                window.location.hash = '';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <h1 className={`font-serif font-bold text-gray-900 tracking-tight transition-all duration-300 ${isScrolled ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
                Nextgen<span className="text-gray-300">.</span>
              </h1>
            </div>

            <div className="flex items-center justify-end gap-1 md:gap-4 flex-1">
              <div className="hidden md:flex items-center relative" ref={searchRef}>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
                    placeholder="Search products..." 
                    className="w-0 group-hover:w-48 focus:w-48 transition-all duration-300 border-b border-gray-300 focus:border-black bg-transparent py-1 px-2 text-sm outline-none"
                  />
                  <button className="p-2 hover:bg-gray-100 rounded-full text-gray-900 min-h-[44px] min-w-[44px] flex items-center justify-center">
                    {isSearching ? <Loader2 size={18} className="animate-spin text-gray-400" /> : <Search size={20} strokeWidth={1.5} />}
                  </button>
                </div>
                <SearchDropdown results={searchResults} loading={isSearching} />
              </div>

              <button 
                className="md:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search size={20} strokeWidth={1.5} />
              </button>

              <div className="relative hidden md:block">
                <button 
                  onClick={handleUserClick}
                  className={`p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 min-h-[44px] ${isAuthenticated ? 'text-black font-medium' : 'text-gray-900'}`}
                >
                  <User size={20} strokeWidth={1.5} />
                  {isAuthenticated && <span className="text-xs uppercase font-bold">{customer?.firstName}</span>}
                </button>

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

              <button 
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors group min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <CustomCartIcon className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 md:top-0 md:right-0 bg-black text-white text-[9px] md:text-[10px] font-bold h-3.5 w-3.5 md:h-4 md:w-4 rounded-full flex items-center justify-center ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div 
            className={`overflow-visible transition-all duration-300 ease-in-out relative ${
              showSearch ? 'max-h-24 opacity-100 mt-2 pb-4' : 'max-h-0 opacity-0'
            }`}
            ref={mobileSearchRef}
          >
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                autoFocus={showSearch}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <X size={16} />
                </button>
              )}
              <SearchDropdown results={searchResults} loading={isSearching} isMobile={true} />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
