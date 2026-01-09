
import React, { useState, useRef } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { ShopifyProduct, TransitionRect } from '../../types/index';
import { CustomCartIcon } from '../../components/icons/CustomCartIcon';
import { Select } from '../../components/ui/Select';
import { ShopifyImage } from '../../components/ui/ShopifyImage';

interface ProductCardProps {
  product: ShopifyProduct;
  onAddToCart: (product: ShopifyProduct, variantId?: string) => void;
  onClick: (product: ShopifyProduct, rect?: TransitionRect) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  const { title, featuredImage, variants } = product;
  const imageRef = useRef<HTMLDivElement>(null);
  
  const hasMultipleVariants = variants.edges.length > 1;
  const [selectedVariantId, setSelectedVariantId] = useState(variants.edges[0]?.node.id);
  
  const currentVariant = variants.edges.find(e => e.node.id === selectedVariantId)?.node || variants.edges[0]?.node;
  const price = currentVariant?.price;
  const isAvailable = currentVariant?.availableForSale;

  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;
    
    setIsAdding(true);
    onAddToCart(product, selectedVariantId);
    setTimeout(() => setIsAdding(false), 400);
  };

  const handleClick = () => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      onClick(product, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
    } else {
      onClick(product);
    }
  };

  const currentPriceValue = parseFloat(price?.amount || '0');
  const originalPriceValue = currentPriceValue * 1.25; 
  const discountPercentage = Math.round(((originalPriceValue - currentPriceValue) / originalPriceValue) * 100);

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price?.currencyCode || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formattedPrice = currencyFormatter.format(currentPriceValue);
  const formattedComparePrice = currencyFormatter.format(originalPriceValue);

  const variantOptions = variants.edges.map(({ node }) => ({
    value: node.id,
    label: node.title === 'Default Title' ? 'One Size' : node.title
  }));

  return (
    <div 
        className="group relative flex flex-col h-full bg-transparent cursor-pointer"
        onClick={handleClick}
    >
      <div 
        ref={imageRef}
        className="relative aspect-[3/4] bg-gray-50 overflow-hidden rounded-xl border border-gray-100 shadow-sm transition-all duration-300"
      >
        <ShopifyImage
          src={featuredImage?.url || 'https://picsum.photos/400/500'}
          alt={featuredImage?.altText || title}
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        
        {isAvailable && (
          <div className="absolute top-0 left-0 bg-red-600 text-white text-[8px] md:text-[10px] font-medium px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-br-lg shadow-sm z-20">
            -{discountPercentage}%
          </div>
        )}

        <button 
          className="absolute top-1.5 right-1.5 p-1 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors z-20 shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Heart size={14} />
        </button>

        {/* Rectangular Mobile Button with more horizontal padding */}
        <button 
             onClick={handleAddToCart}
             disabled={!isAvailable || isAdding}
             className={`md:hidden absolute bottom-2 right-2 z-30 flex items-center justify-center h-9 px-4 rounded-lg shadow-lg transition-all duration-200 active:scale-90 border border-gray-100 ${
                !isAvailable 
                ? 'bg-gray-200 text-gray-400' 
                : isAdding
                    ? 'bg-black text-white' 
                    : 'bg-white text-black' 
             }`}
           >
              {isAdding ? (
                 <Loader2 size={12} className="animate-spin" />
              ) : (
                 <CustomCartIcon className="w-4 h-4" />
              )}
        </button>

        <div className="absolute inset-x-3 bottom-3 translate-y-[120%] transition-transform duration-300 ease-snappy group-hover:translate-y-0 z-10 hidden md:block">
           <button
             onClick={handleAddToCart}
             disabled={!isAvailable || isAdding}
             className="w-full bg-white text-gray-900 py-3 rounded-xl font-semibold text-[11px] uppercase tracking-[0.1em] shadow-lg hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
           >
             {isAdding ? <Loader2 size={16} className="animate-spin" /> : 'Quick Add'}
           </button>
        </div>
      </div>

      <div className="flex flex-col pt-2.5 pb-1 px-0.5 space-y-1 flex-1">
        <h3 className="text-[10px] md:text-xs font-medium text-gray-900 line-clamp-1 transition-colors group-hover:text-black">
           {title}
        </h3>
        
        <div className="w-full relative z-20 h-6" onClick={e => e.stopPropagation()}>
            {hasMultipleVariants ? (
                <Select 
                    value={selectedVariantId}
                    onChange={setSelectedVariantId}
                    options={variantOptions}
                    className="text-[9px] h-6 py-0"
                />
            ) : (
                <div className="flex items-center h-full">
                    <span className="text-[8px] md:text-[9px] font-medium text-gray-400 uppercase tracking-widest">
                      One Size
                    </span>
                </div>
            )}
        </div>

        <div className="flex items-center gap-1.5 mt-auto pt-0.5">
            <span className="text-[11px] md:text-sm font-semibold text-gray-900">
                {formattedPrice}
            </span>
            <span className="text-[9px] text-gray-400 line-through font-normal">
                {formattedComparePrice}
            </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
