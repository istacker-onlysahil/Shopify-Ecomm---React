
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
  showSearchOverride?: boolean;
  onSearchToggle?: (show: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isScrolled, 
  selectedProduct,
  collections = [],
  setMobileMenuOpen, 
  onSelectProduct, 
  setCartOpen, 
  cartCount,
  showSearchOverride,
  onSearchToggle
}) => {
  const [localShowSearch, setLocalShowSearch] = useState(false);
  const showSearch = showSearchOverride !== undefined ? showSearchOverride : localShowSearch;
  const setShowSearch = onSearchToggle || setLocalShowSearch;

  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const { isAuthenticated, customer, logout, setShowAuthModal, setAuthView } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ShopifyProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const announcements = [
    "Complimentary Worldwide Delivery Over $200",
    "Discover the SS25 Capsule Collection",
    "Subscribe for exclusive access"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
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
    }, 400);

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
      <div className={`absolute left-0 right-0 z-[100] mt-3 overflow-hidden bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl animate-scale-in origin-top ${isMobile ? 'top-full' : 'top-full'}`}>
        <div className="p-4">
          <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">Suggestions</h4>
          
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-gray-200" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={(e) => {
                    e.preventDefault();
                    handleProductSelect(product);
                  }}
                  className="w-full flex items-center gap-4 p-2 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="w-12 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <ShopifyImage src={product.featuredImage?.url || ''} alt="" sizes="50px" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                    <p className="text-xs text-gray-400 font-medium">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: product.priceRange.minVariantPrice.currencyCode }).format(parseFloat(product.priceRange.minVariantPrice.amount))}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-center text-gray-400 py-6 italic font-medium">No results found for "{searchQuery}"</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`bg-[#0a0a0a] text-white text-[10px] py-2.5 text-center font-medium tracking-[0.2em] uppercase relative z-50`}>
        <div className="transition-all duration-700 ease-in-out px-4" key={announcementIndex}>
            {announcements[announcementIndex]}
        </div>
      </div>

      <nav 
        className={`sticky top-0 w-full z-40 transition-all duration-500 border-b ${
          isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-gray-50 py-3' 
          : 'bg-white/90 backdrop-blur-sm border-transparent py-4 md:py-6'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center gap-4 flex-1">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-gray-900"
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>

              <div className="hidden lg:flex items-center gap-10 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                <button 
                  onClick={() => navigateToCollection('new-arrivals')}
                  className="hover:text-black transition-colors"
                >
                  Shop
                </button>
                <div className="relative group h-full">
                  <button className="flex items-center gap-1.5 hover:text-black transition-colors py-2">
                    Collections <ChevronDown size={14} strokeWidth={1.5} />
                  </button>
                  <div className="absolute top-full left-0 mt-0 w-56 bg-white border border-gray-100 shadow-2xl rounded-xl py-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0 z-[110]">
                     {collections.map(col => (
                       <button 
                         key={col.id}
                         onClick={() => navigateToCollection(col.handle)}
                         className="w-full text-left px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 hover:bg-gray-50 hover:text-black transition-all"
                       >
                         {col.title}
                       </button>
                     ))}
                  </div>
                </div>
                <button className="hover:text-black transition-colors">Journal</button>
              </div>
            </div>

            <div 
              className="flex-shrink-0 cursor-pointer text-center"
              onClick={() => {
                window.location.hash = '';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <h1 className={`font-serif font-bold text-gray-900 tracking-tight transition-all duration-500 ${isScrolled ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
                Nextgen<span className="text-gray-300">.</span>
              </h1>
            </div>

            <div className="flex items-center justify-end gap-2 md:gap-5 flex-1">
              <div className="hidden md:flex items-center relative" ref={searchRef}>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Discover..." 
                    className="w-0 group-hover:w-48 focus:w-48 transition-all duration-500 border-b border-gray-100 focus:border-black bg-transparent py-1.5 px-2 text-[11px] font-medium tracking-wide outline-none placeholder:text-gray-300"
                  />
                  <button className="p-2.5 hover:bg-gray-50 rounded-full text-gray-900 transition-colors">
                    {isSearching ? <Loader2 size={18} className="animate-spin text-gray-300" /> : <Search size={18} strokeWidth={1.5} />}
                  </button>
                </div>
                <SearchDropdown results={searchResults} loading={isSearching} />
              </div>

              <div className="relative hidden md:block">
                <button 
                  onClick={handleUserClick}
                  className="p-2.5 hover:bg-gray-50 rounded-full transition-all flex items-center gap-2 text-gray-900"
                >
                  <User size={18} strokeWidth={1.5} />
                  {isAuthenticated && <span className="text-[10px] uppercase font-semibold tracking-widest">{customer?.firstName}</span>}
                </button>

                {isAuthenticated && showUserMenu && (
                  <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl border border-gray-50 py-2 animate-scale-in origin-top-right">
                    <div className="px-5 py-3 border-b border-gray-50">
                      <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-widest">Access Profile</p>
                      <p className="text-xs font-semibold text-gray-900 truncate">{customer?.email}</p>
                    </div>
                    <button 
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="w-full text-left px-5 py-3 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 text-gray-900 hover:bg-gray-50 rounded-full transition-all group"
              >
                <CustomCartIcon className="w-5 h-5 md:w-5 md:h-5 stroke-[1.25px]" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-black text-white text-[8px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div 
            className={`overflow-hidden transition-all duration-500 ease-in-out relative ${
              showSearch ? 'max-h-24 opacity-100 mt-4 pb-2' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search our selection..." 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-11 pr-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black"
                autoFocus={showSearch}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
              <SearchDropdown results={searchResults} loading={isSearching} isMobile={true} />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
