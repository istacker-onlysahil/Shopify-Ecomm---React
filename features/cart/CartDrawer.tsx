
import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, Truck, Tag, Gift, ChevronRight, MessageSquare, ShieldCheck } from 'lucide-react';
import { CartItem } from '../../types/index';
import { DEFAULT_CONFIG } from '../../config/constants';
import { Select } from '../../components/ui/Select';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onUpdateVariant: (oldId: string, newId: string) => void;
  onRemove: (id: string) => void;
}

// Mock Upsell Items
const UPSELL_ITEMS = [
  { id: 'upsell-1', title: 'Premium Fabric Care Kit', price: 25.00, image: 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?auto=format&fit=crop&q=80&w=200' },
  { id: 'upsell-2', title: 'Signature Gift Wrapping', price: 8.00, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=200' },
  { id: 'upsell-3', title: 'Express Delivery Pass', price: 12.00, image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=200' },
];

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, onUpdateVariant, onRemove }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const currencyCode = items[0]?.currency || 'USD';
  
  // Free Shipping Logic
  const freeShippingThreshold = 200;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remaining = freeShippingThreshold - subtotal;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    const variantString = items.map(item => {
      const cleanId = item.id.split('/').pop();
      return `${cleanId}:${item.quantity}`;
    }).join(',');

    const shopDomain = DEFAULT_CONFIG.domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const checkoutUrl = `https://${shopDomain}/cart/${variantString}`;

    setTimeout(() => {
      window.location.href = checkoutUrl;
      setIsCheckingOut(false);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[4px] transition-opacity duration-300 animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pointer-events-none">
        <div className="pointer-events-auto w-full md:w-[480px] bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-out animate-slide-in-right">
          
          {/* --- Header --- */}
          <div className="px-4 py-4 md:px-6 md:py-5 border-b border-gray-100 bg-white z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                Cart
                <span className="text-xs font-bold text-white bg-black px-2 py-0.5 rounded-full">{items.length}</span>
              </h2>
              <button 
                onClick={onClose}
                className="p-2 -mr-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {items.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-center justify-between text-xs md:text-sm mb-2">
                   {remaining > 0 ? (
                     <span className="text-gray-600">Add <span className="font-bold text-gray-900">{formatPrice(remaining)}</span> for <span className="font-bold text-green-600 uppercase tracking-wide">Free Shipping</span></span>
                   ) : (
                     <span className="text-green-600 font-bold flex items-center gap-1.5 uppercase tracking-wide text-xs"><Truck size={14} /> You've unlocked Free Shipping!</span>
                   )}
                   <span className="font-bold text-gray-900">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 ease-out rounded-full relative ${progress === 100 ? 'bg-green-500' : 'bg-black'}`}
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 animate-shimmer" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- Scrollable Content --- */}
          <div className="flex-1 overflow-y-auto bg-white scrollbar-hide">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-8">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center animate-pulse">
                   <ShoppingBag size={32} className="text-gray-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Your cart is empty</h3>
                  <p className="text-gray-500 text-xs mt-2">Looks like you haven't made your choice yet.</p>
                </div>
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-black text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                {/* Cart Items */}
                <div className="px-4 py-2 md:px-6 space-y-4 md:space-y-6 pt-4">
                  {items.map((item, idx) => (
                    <div key={item.id} className="flex gap-3 md:gap-4 group animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                      {/* Image */}
                      <div className="h-24 w-20 md:h-28 md:w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex flex-1 flex-col justify-between py-0.5">
                        <div className="space-y-1">
                           <div className="flex justify-between items-start gap-2">
                             <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight line-clamp-2">{item.title}</h3>
                             <p className="font-bold text-gray-900 text-sm whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                           </div>
                           
                           {/* Variant Selector or Badge */}
                           <div className="w-full max-w-[140px] mt-1">
                                {item.variants && item.variants.length > 1 ? (
                                    <Select 
                                        value={item.id}
                                        onChange={(newId) => onUpdateVariant(item.id, newId)}
                                        options={item.variants.map(v => ({
                                            value: v.id,
                                            label: v.title === 'Default Title' ? 'One Size' : v.title
                                        }))}
                                        className="h-6 text-[10px] md:text-xs py-0"
                                    />
                                ) : (
                                    <p className="text-xs text-gray-500 font-medium bg-gray-50 inline-block px-1.5 py-0.5 rounded border border-gray-100">
                                        {item.variantTitle !== 'Default Title' ? item.variantTitle : 'One Size'}
                                    </p>
                                )}
                           </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {/* Qty */}
                          <div className="flex items-center border border-gray-200 rounded-md px-1 py-0.5 bg-white shadow-sm h-8">
                            <button 
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="w-7 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 rounded-sm transition-colors disabled:opacity-30"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-xs font-bold tabular-nums">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="w-7 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 rounded-sm transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => onRemove(item.id)}
                            className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all opacity-100 md:opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 my-6 mx-4 md:mx-6" />

                {/* Upsells */}
                <div className="px-4 md:px-6 pb-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Complete your look</h4>
                  <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide md:grid md:grid-cols-1 md:gap-3 md:mx-0 md:px-0 md:overflow-visible">
                    {UPSELL_ITEMS.map((upsell) => (
                      <div key={upsell.id} className="flex-shrink-0 w-60 md:w-full flex items-center gap-3 p-2 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all group cursor-pointer">
                         <div className="h-14 w-14 rounded-lg overflow-hidden bg-white border border-gray-100">
                           <img src={upsell.image} alt={upsell.title} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="text-sm font-semibold text-gray-900 truncate">{upsell.title}</p>
                           <p className="text-xs text-gray-500">{formatPrice(upsell.price)}</p>
                         </div>
                         <button className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-900 shadow-sm group-hover:bg-black group-hover:text-white group-hover:border-black transition-colors">
                           <Plus size={14} />
                         </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extras */}
                <div className="px-4 md:px-6 space-y-2 mb-6">
                   {/* Order Note Toggle */}
                   <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => setNoteOpen(!noteOpen)}
                        className="w-full flex items-center justify-between p-3 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                         <span className="flex items-center gap-2"><MessageSquare size={14} /> Add Order Note</span>
                         <ChevronRight size={14} className={`transition-transform duration-200 ${noteOpen ? 'rotate-90' : ''}`} />
                      </button>
                      {noteOpen && (
                        <div className="p-3 bg-gray-50 border-t border-gray-200 animate-slide-down">
                           <textarea 
                             className="w-full text-xs p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none bg-white resize-none"
                             rows={3}
                             placeholder="Special instructions for seller..."
                           />
                        </div>
                      )}
                   </div>
                   
                   {/* Gift Option */}
                   <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white">
                      <Gift size={16} className="text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-900">This order is a gift</p>
                        <p className="text-[10px] text-gray-500">Prices will be hidden on receipt</p>
                      </div>
                      <input type="checkbox" className="rounded text-black focus:ring-black border-gray-300 h-4 w-4 cursor-pointer" />
                   </div>
                </div>

              </div>
            )}
          </div>

          {/* --- Footer --- */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 bg-white px-4 py-4 md:px-6 md:py-6 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-20">
              
              {/* Coupon Input */}
              <div className="relative mb-4">
                 <input 
                   type="text" 
                   value={couponCode}
                   onChange={(e) => setCouponCode(e.target.value)}
                   placeholder="Gift card or discount code"
                   className="w-full pl-9 pr-20 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black focus:bg-white transition-all"
                 />
                 <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                 <button 
                   disabled={!couponCode}
                   className="absolute right-1 top-1 bottom-1 px-3 bg-white text-xs font-bold uppercase tracking-wider rounded-md border border-gray-100 text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                 >
                   Apply
                 </button>
              </div>

              {/* Totals */}
              <div className="space-y-1.5 mb-6">
                <div className="flex justify-between text-xs text-gray-500">
                  <p>Subtotal</p>
                  <p className="font-medium text-gray-900">{formatPrice(subtotal)}</p>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <p>Shipping</p>
                  <p className="font-medium text-green-600">
                    {remaining <= 0 ? 'Free' : 'Calculated at checkout'}
                  </p>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <p>Taxes</p>
                  <p className="font-medium text-gray-900">Calculated at checkout</p>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-100 mt-2">
                  <p>Total</p>
                  <p>{formatPrice(subtotal)}</p>
                </div>
              </div>
              
              {/* Checkout Btn */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="relative w-full overflow-hidden bg-black text-white py-3.5 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl flex items-center justify-center gap-2 group disabled:opacity-80 disabled:cursor-wait"
              >
                 {isCheckingOut ? (
                   <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing</span>
                 ) : (
                   <>
                     Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                   </>
                 )}
              </button>
              
              {/* Trust Badges */}
              <div className="flex flex-col items-center gap-2 mt-4 opacity-60">
                <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  <ShieldCheck size={12} /> Secure Encrypted Checkout
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
