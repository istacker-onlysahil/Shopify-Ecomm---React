import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, Check, Shield, Truck } from 'lucide-react';
import { ShopifyProduct } from '../types';

interface ProductDetailProps {
  product: ShopifyProduct;
  onBack: () => void;
  onAddToCart: (product: ShopifyProduct) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart }) => {
  const { title, description, descriptionHtml, priceRange, images, variants } = product;
  const price = priceRange.minVariantPrice;
  
  // Use all images including featured, filter out duplicates if any
  const allImages = images.edges.map(e => e.node);
  if (product.featuredImage && !allImages.find(img => img.url === product.featuredImage?.url)) {
      allImages.unshift(product.featuredImage);
  }
  
  const [selectedImage, setSelectedImage] = useState(allImages[0]?.url || '');
  const isAvailable = variants.edges.some(v => v.node.availableForSale);

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 lg:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={onBack}
          className="group inline-flex items-center gap-2 text-sm text-gray-500 hover:text-accent mb-8 transition-colors duration-300 ease-buttery"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300 ease-buttery" />
          Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12">
          
          {/* Image Gallery */}
          <div className="lg:col-span-7 space-y-4 animate-slide-up">
            <div className="aspect-[3/4] lg:aspect-[4/5] bg-gray-50 rounded-lg overflow-hidden cursor-zoom-in">
              <img 
                src={selectedImage} 
                alt={title}
                className="w-full h-full object-cover object-center transition-transform duration-300 ease-buttery hover:scale-105"
              />
            </div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(img.url)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 ease-buttery ${
                      selectedImage === img.url ? 'border-primary opacity-100' : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-200'
                    }`}
                  >
                    <img 
                      src={img.url} 
                      alt={img.altText || `View ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 flex flex-col pt-0 lg:pt-8 animate-slide-up" style={{ animationDelay: '50ms' }}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight">{title}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <p className="text-2xl font-medium text-gray-900">
                {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
              </p>
              {isAvailable ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-green-50 text-green-700 border border-green-100">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> In Stock
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-red-50 text-red-700 border border-red-100">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="border-t border-gray-100 py-8 mb-8">
              <div 
                className="prose prose-sm text-gray-600 prose-headings:font-serif prose-a:text-accent"
                dangerouslySetInnerHTML={{ __html: descriptionHtml || description }}
              />
            </div>

            <div className="space-y-6 mt-auto">
              <button
                onClick={() => isAvailable && onAddToCart(product)}
                disabled={!isAvailable}
                className={`w-full group flex items-center justify-center gap-3 py-5 px-8 text-sm uppercase tracking-widest font-bold text-white shadow-md transition-all duration-300 ease-buttery ${
                  isAvailable 
                    ? 'bg-gray-900 hover:bg-accent hover:shadow-xl hover:-translate-y-1' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <ShoppingBag size={18} className="group-hover:animate-bounce" />
                {isAvailable ? 'Add to Cart' : 'Sold Out'}
              </button>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-500 pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-full text-gray-900"><Truck size={16} /></div>
                  <span className="font-medium">Free Shipping</span>
                </div>
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-gray-50 rounded-full text-gray-900"><Shield size={16} /></div>
                  <span className="font-medium">Secure Payment</span>
                </div>
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-gray-50 rounded-full text-gray-900"><Check size={16} /></div>
                  <span className="font-medium">Quality Guarantee</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;