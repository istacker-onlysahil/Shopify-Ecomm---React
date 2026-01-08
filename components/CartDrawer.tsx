
import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, ExternalLink } from 'lucide-react';
import { CartItem } from '../types';
import { DEFAULT_CONFIG } from '../constants';
import { ShopifyImage } from './ui/ShopifyImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const currency = items[0]?.currency || 'USD';

  // Generate Shopify Permalink for Checkout
  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // Construct variant string: variant_id:quantity,variant_id:quantity
    const variantString = items.map(item => {
      // Clean ID (remove gid://shopify/ProductVariant/)
      const cleanId = item.id.split('/').pop();
      return `${cleanId}:${item.quantity}`;
    }).join(',');

    const shopDomain = DEFAULT_CONFIG.domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const checkoutUrl = `https://${shopDomain}/cart/${variantString}`;

    // Small delay for visual feedback
    setTimeout(() => {
      window.location.href = checkoutUrl;
      setIsCheckingOut(false);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pointer-events-none">
        <div className="pointer-events-auto w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-slide-in-right">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100 bg-white">
            <h2 className="text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag size={20} />
              Your Bag ({items.length})
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-6 animate-fade-in-up">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                   <ShoppingBag size={32} />
                </div>
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-900">Your bag is empty.</p>
                    <p className="text-sm mt-1">Looks like you haven't added anything yet.</p>
                </div>
                <button 
                  onClick={onClose}
                  className="text-primary font-bold text-sm border-b-2 border-primary pb-0.5 hover:text-accent hover:border-accent transition-colors duration-200"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <ul className="space-y-6">
                {items.map((item, idx) => (
                  <li key={item.id} className="flex bg-white p-3 rounded-lg shadow-sm border border-gray-100 animate-slide-up" style={{ animationDelay: `${idx * 30}ms` }}>
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                      <ShopifyImage
                        src={item.image}
                        alt={item.title}
                        width={96}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3 className="line-clamp-1">{item.title}</h3>
                          <p className="ml-4 font-serif">{item.currency} {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{item.variantTitle}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm mt-2">
                        <div className="flex items-center border border-gray-200 rounded-md bg-white">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1.5 hover:bg-gray-100 disabled:opacity-50 text-gray-600 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-2.5 font-medium min-w-[1.5rem] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemove(item.id)}
                          className="font-medium text-red-500 hover:text-red-700 flex items-center gap-1.5 text-xs uppercase tracking-wide transition-colors"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-8 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                <p>Subtotal</p>
                <p className="font-serif text-lg">{currency} {total.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-xs text-gray-500 mb-6">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className={`w-full flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-4 text-sm uppercase tracking-widest font-bold text-white shadow-sm hover:bg-accent transition-all duration-300 ease-buttery hover:shadow-lg hover:-translate-y-0.5 ${isCheckingOut ? 'opacity-80 cursor-wait' : ''}`}
                >
                  {isCheckingOut ? 'Redirecting...' : (
                    <>
                      Checkout <ExternalLink size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
