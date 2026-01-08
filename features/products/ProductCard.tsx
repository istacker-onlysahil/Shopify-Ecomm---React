
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
  
  // Variant State Management
  const hasMultipleVariants = variants.edges.length > 1;
  const [selectedVariantId, setSelectedVariantId] = useState(variants.edges[0]?.node.id);
  
  // Find current selected variant details
  const currentVariant = variants.edges.find(e => e.node.id === selectedVariantId)?.node || variants.edges[0]?.node;
  const price = currentVariant?.price;
  const isAvailable = currentVariant?.availableForSale;

  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;
    
    // Set loading state briefly for visual feedback
    setIsAdding(true);
    
    // Execute instantly
    onAddToCart(product, selectedVariantId);
    
    // Reset state after a very small frame to show the transition
    setTimeout(() => setIsAdding(false), 300);
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

  // Pricing Logic
  const currentPriceValue = parseFloat(price?.amount || '0');
  // Simulating a "Compare At" price for demo purposes
  const originalPriceValue = currentPriceValue * 1.25; 
  const discountPercentage = Math.round(((originalPriceValue - currentPriceValue) / originalPriceValue) * 100);

  // Formatters
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price?.currencyCode || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formattedPrice = currencyFormatter.format(currentPriceValue);
  const formattedComparePrice = currencyFormatter.format(originalPriceValue);

  // Prepare options for Select
  const variantOptions = variants.edges.map(({ node }) => ({
    value: node.id,
    label: node.title === 'Default Title' ? 'One Size' : node.title
  }));

  return (
    <div 
        className="group relative flex flex-col h-full bg-transparent cursor-pointer"
        onClick={handleClick}
    >
      {/* Image Container - Fully Rounded to match button style */}
      <div 
        ref={imageRef}
        className="relative aspect-[3/4] bg-gray-50 overflow-hidden rounded-xl border border-gray-100/50 shadow-sm transition-all duration-300 hover:shadow-md"
      >
        <ShopifyImage
          src={featuredImage?.url || 'https://picsum.photos/400/500'}
          alt={featuredImage?.altText || title}
          // OPTIMIZATION FIXED: Significantly increased sizing to prevent blurriness on Retina screens.
          // Mobile: 60vw (oversampled for sharpness on 3-col grid)
          // Tablet: 40vw
          // Desktop: 30vw
          sizes="(max-width: 640px) 60vw, (max-width: 1024px) 40vw, 30vw"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {/* Discount Badge - Hugs the corner */}
        {isAvailable && (
          <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] md:text-[11px] font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-br-xl shadow-sm z-20">
            -{discountPercentage}%
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          className="absolute top-2 right-2 md:top-2.5 md:right-2.5 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:bg-white hover:text-red-500 transition-colors z-20 shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Heart size={16} className="md:w-5 md:h-5" />
        </button>

        {/* Mobile Add Button - Inside Media, Rectangle, Matching Radius */}
        <button 
             onClick={handleAddToCart}
             disabled={!isAvailable || isAdding}
             className={`md:hidden absolute bottom-2 right-2 z-30 flex items-center justify-center w-10 h-8 rounded-lg shadow-lg transition-colors duration-200 active:scale-95 border border-gray-100 ${
                !isAvailable 
                ? 'bg-gray-200 text-gray-400' 
                : isAdding
                    ? 'bg-black text-white' // Clicked State: Black
                    : 'bg-white text-black' // Default State: White
             }`}
           >
              {isAdding ? (
                 <Loader2 size={12} className="animate-spin text-white" />
              ) : (
                 <CustomCartIcon className={`w-4 h-4 ${!isAvailable ? 'text-gray-400' : 'text-black'}`} />
              )}
        </button>

        {/* Desktop Quick Add Overlay */}
        <div className="absolute inset-x-3 bottom-3 translate-y-[120%] transition-transform duration-300 ease-buttery group-hover:translate-y-0 z-10 hidden md:block">
           <button
             onClick={handleAddToCart}
             disabled={!isAvailable || isAdding}
             className="w-full bg-white/95 backdrop-blur-md text-gray-900 py-3 rounded-xl font-bold text-[11px] uppercase tracking-wide shadow-lg hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
           >
             {isAdding ? (
               <Loader2 size={16} className="animate-spin" />
             ) : (
               <>
                 <CustomCartIcon className="w-5 h-5 fill-current" /> {isAvailable ? 'Quick Add' : 'Sold Out'}
               </>
             )}
           </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col pt-2 md:pt-3 pb-1 px-0.5 md:px-1 space-y-1 md:space-y-2 flex-1">
        
        {/* Title */}
        <h3 className="text-xs md:text-sm font-semibold text-gray-900 line-clamp-1" title={title}>
           {title}
        </h3>
        
        {/* Variant Select */}
        <div className="w-full relative z-20 h-7 md:h-8" onClick={e => e.stopPropagation()}>
            {hasMultipleVariants ? (
                <Select 
                    value={selectedVariantId}
                    onChange={setSelectedVariantId}
                    options={variantOptions}
                    className="text-[10px] md:text-xs"
                />
            ) : (
                <div className="flex items-center h-full">
                    <span className="inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 rounded-md text-[10px] font-medium bg-gray-50 text-gray-400 border border-gray-100">
                      One Size
                    </span>
                </div>
            )}
        </div>

        {/* Price Row */}
        <div className="flex items-center gap-1.5 md:gap-2 mt-auto pt-0.5 md:pt-1">
            <span className="text-sm md:text-base font-bold text-gray-900">
                {formattedPrice}
            </span>
            <span className="text-[10px] md:text-[11px] text-gray-400 line-through font-medium">
                {formattedComparePrice}
            </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
