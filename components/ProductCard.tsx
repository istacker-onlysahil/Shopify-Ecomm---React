import React from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import { ShopifyProduct } from '../types';

interface ProductCardProps {
  product: ShopifyProduct;
  onAddToCart: (product: ShopifyProduct) => void;
  onClick: (product: ShopifyProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  const { title, priceRange, featuredImage, variants } = product;
  const price = priceRange.minVariantPrice;
  const isAvailable = variants.edges.some(v => v.node.availableForSale);

  return (
    <div className="group relative flex flex-col h-full bg-white transition-transform duration-300 ease-buttery hover:-translate-y-1">
      <div 
        className="aspect-[4/5] bg-gray-100 overflow-hidden relative cursor-pointer rounded-sm"
        onClick={() => onClick(product)}
      >
        <img
          src={featuredImage?.url || 'https://picsum.photos/400/500'}
          alt={featuredImage?.altText || title}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-300 ease-buttery group-hover:scale-105"
        />
        
        {!isAvailable && (
          <div className="absolute top-3 right-3 bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-900 shadow-sm">
            Sold Out
          </div>
        )}

        {/* Desktop Overlay Button (Hidden on Mobile) */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 ease-buttery group-hover:translate-y-0 hidden md:block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isAvailable) onAddToCart(product);
            }}
            disabled={!isAvailable}
            className={`w-full py-3 px-4 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wide text-white shadow-xl ${
              isAvailable ? 'bg-gray-900 hover:bg-accent' : 'bg-gray-400 cursor-not-allowed'
            } transition-colors duration-200`}
          >
            {isAvailable ? (
              <>
                <ShoppingCart size={16} /> Add to Cart
              </>
            ) : 'Out of Stock'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4 pb-2 space-y-2">
        <h3 className="text-base font-medium text-gray-900 transition-colors cursor-pointer" onClick={() => onClick(product)}>
           {title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 font-serif italic">
            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </p>
          
          {/* Mobile "Add" Button (Visible only on small screens) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isAvailable) onAddToCart(product);
            }}
            disabled={!isAvailable}
            className={`md:hidden p-2 rounded-full ${
               isAvailable ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' : 'bg-gray-50 text-gray-300'
            } transition-colors`}
            aria-label="Add to cart"
          >
             {isAvailable ? <Plus size={18} /> : <ShoppingCart size={18} className="opacity-50" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;