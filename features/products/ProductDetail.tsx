
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ArrowLeft, ShoppingBag, Truck, Shield, ChevronDown, ChevronUp, Heart, ChevronRight } from 'lucide-react';
import { ShopifyProduct, TransitionRect } from '../../types/index';
import { ShopifyImage, getOptimizedImageUrl } from '../../components/ui/ShopifyImage';

interface ProductDetailProps {
  product: ShopifyProduct;
  originRect?: TransitionRect | null;
  onBack: () => void;
  onAddToCart: (product: ShopifyProduct, variantId?: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, originRect, onBack, onAddToCart }) => {
  const { title, description, descriptionHtml, images, variants } = product;
  
  const [selectedVariantId, setSelectedVariantId] = useState(variants.edges[0]?.node.id);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('details');
  const [isScrolledPastCTA, setIsScrolledPastCTA] = useState(false);
  const mainButtonRef = useRef<HTMLButtonElement>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Animation States
  const [isAnimating, setIsAnimating] = useState(!!originRect);
  const [showRealContent, setShowRealContent] = useState(!originRect);
  const [animStyle, setAnimStyle] = useState<React.CSSProperties>({});
  const placeholderRef = useRef<HTMLDivElement>(null);

  const currentVariant = variants.edges.find(v => v.node.id === selectedVariantId)?.node || variants.edges[0]?.node;
  const price = currentVariant.price;

  const allImages = images.edges.map(e => e.node);
  if (product.featuredImage && !allImages.find(img => img.url === product.featuredImage?.url)) {
      allImages.unshift(product.featuredImage);
  }
  
  const [selectedImage, setSelectedImage] = useState(allImages[0]?.url || '');
  const isAvailable = currentVariant.availableForSale;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price?.currencyCode || 'USD',
  }).format(parseFloat(price?.amount || '0'));

  // --- Autoplay Logic ---
  useEffect(() => {
    if (!isAutoPlaying || allImages.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => {
        const currentIndex = allImages.findIndex(img => img.url === prev);
        const nextIndex = (currentIndex + 1) % allImages.length;
        return allImages[nextIndex].url;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, allImages]);

  const handleManualSelection = (url: string) => {
    setSelectedImage(url);
    setIsAutoPlaying(false); // Stop autoplay when user manually interacts
  };

  // --- Scroll Lock during Animation ---
  useEffect(() => {
    if (isAnimating) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isAnimating]);

  // --- Animation Logic (FLIP) ---
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });

    if (!originRect) return;

    setAnimStyle({
      position: 'fixed',
      top: originRect.top,
      left: originRect.left,
      width: originRect.width,
      height: originRect.height,
      zIndex: 9999,
      borderRadius: '0.75rem', 
      transition: 'none',
      objectFit: 'cover'
    });

    const frameId = requestAnimationFrame(() => {
       requestAnimationFrame(() => {
          if (!placeholderRef.current) return;
          const destRect = placeholderRef.current.getBoundingClientRect();

          setAnimStyle({
            position: 'fixed',
            top: destRect.top,
            left: destRect.left,
            width: destRect.width,
            height: destRect.height,
            zIndex: 9999,
            borderRadius: '1.5rem', 
            transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)', 
            objectFit: 'cover'
          });
          
          const revealTimeout = setTimeout(() => {
             setShowRealContent(true);
          }, 30); 

          const cleanupTimeout = setTimeout(() => {
            setIsAnimating(false);
          }, 550); 

          return () => {
             clearTimeout(revealTimeout);
             clearTimeout(cleanupTimeout);
          };
       });
    });

    return () => cancelAnimationFrame(frameId);
  }, [originRect]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolledPastCTA(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (mainButtonRef.current) {
      observer.observe(mainButtonRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const Accordion = ({ id, title, children }: { id: string, title: string, children?: React.ReactNode }) => (
    <div className="border-b border-gray-100">
      <button 
        onClick={() => setActiveAccordion(activeAccordion === id ? null : id)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-sm font-bold uppercase tracking-widest text-gray-900">{title}</span>
        {activeAccordion === id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeAccordion === id ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none">
          {children}
        </div>
      </div>
    </div>
  );

  const targetWidths = [165, 360, 533, 720, 940, 1066, 1280, 1500, 1920, 2560];
  const ghostSrcSet = targetWidths
      .map((w) => {
        const url = getOptimizedImageUrl(selectedImage, w);
        return `${url} ${w}w`;
      })
      .join(', ');
  
  const ghostSrc = getOptimizedImageUrl(selectedImage, 600);
  const ghostSizes = "(max-width: 640px) 60vw, (max-width: 1024px) 40vw, 30vw";

  return (
    <div className="min-h-screen bg-white">
      {isAnimating && (
        <div 
            style={animStyle} 
            className="fixed bg-gray-50 overflow-hidden shadow-2xl pointer-events-none"
        >
             <img 
                src={ghostSrc}
                srcSet={ghostSrcSet}
                sizes={ghostSizes}
                alt=""
                decoding="sync"
                className="w-full h-full object-cover object-center block"
             />
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-4 md:pt-12 pb-24">
        
        {/* Breadcrumb Navigation */}
        <div className={`mb-6 transition-opacity duration-300 ${!showRealContent ? 'opacity-0' : 'opacity-100'}`}>
           <nav className="flex items-center gap-2 md:gap-3 text-[11px] md:text-sm text-gray-400 font-medium tracking-wide" aria-label="Breadcrumb">
              <button onClick={onBack} className="hover:text-black transition-colors">Products</button>
              <span className="text-gray-300">/</span>
              <span className="hover:text-black cursor-pointer transition-colors">Collections</span>
              <span className="text-gray-300">/</span>
              <span className="hover:text-black cursor-pointer transition-colors">Featured</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-bold truncate">{title}</span>
           </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 md:gap-x-16 gap-y-0">
          
          {/* Gallery Container - Thumbnails on Left, Main Image on Right */}
          <div className="lg:col-span-7 flex flex-row gap-2 md:gap-4 h-fit max-h-[500px] md:max-h-[680px]">
            
            {/* Left: Thumbnail Column - Restricted to ~4 thumbnails height with scrolling */}
            <div className={`flex flex-col gap-2 md:gap-3 w-14 md:w-24 flex-shrink-0 transition-all duration-500 ease-out overflow-y-auto no-scrollbar scroll-smooth pr-1 ${!showRealContent ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'}`}>
               {allImages.map((img, idx) => (
                 <button 
                   key={idx}
                   onClick={() => handleManualSelection(img.url)}
                   className={`aspect-square md:aspect-[3/4] rounded-lg md:rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all duration-300 ${
                     selectedImage === img.url ? 'border-gray-900 shadow-md ring-1 ring-gray-900 ring-offset-1' : 'border-transparent bg-gray-50 opacity-60 hover:opacity-100 hover:border-gray-200'
                   }`}
                 >
                   <ShopifyImage src={img.url} alt="" sizes="100px" className="w-full h-full object-cover" />
                 </button>
               ))}
            </div>

            {/* Right: Main Product Image */}
            <div 
              ref={placeholderRef}
              className="flex-1 relative bg-gray-50 overflow-hidden rounded-xl md:rounded-[2.5rem] shadow-sm transition-all duration-300 hover:shadow-lg"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <div className="aspect-[3/4] md:aspect-[4/5] w-full">
                 <ShopifyImage 
                    src={selectedImage} 
                    alt={title}
                    priority={true}
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="w-full h-full object-cover object-center"
                />
              </div>

              <button className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg md:hidden z-10">
                <Heart size={20} />
              </button>
            </div>
          </div>

          <div className={`lg:col-span-5 pt-8 lg:pt-0 lg:sticky lg:top-32 h-fit space-y-8 transition-all duration-500 ease-out delay-75 ${!showRealContent ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                    {title}
                  </h1>
                  <button className="hidden md:flex p-3 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Heart size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">{formattedPrice}</p>
                  {isAvailable ? (
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-3 py-1 rounded-full">New Season</span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100">Out of Stock</span>
                  )}
                </div>
              </div>
            
            {variants.edges.length > 1 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-900">Select Variant</label>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {variants.edges.map(({ node }) => (
                      <button
                        key={node.id}
                        onClick={() => setSelectedVariantId(node.id)}
                        className={`min-w-[4rem] px-4 py-3 text-xs font-bold rounded-xl border-2 transition-all ${
                          selectedVariantId === node.id 
                            ? 'bg-black text-white border-black shadow-lg scale-105' 
                            : 'bg-white text-gray-900 border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        {node.title}
                      </button>
                    ))}
                  </div>
                </div>
            )}

              <div className="space-y-4 pt-4">
                <button
                  ref={mainButtonRef}
                  onClick={() => isAvailable && onAddToCart(product, selectedVariantId)}
                  disabled={!isAvailable}
                  className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-[0.98] ${
                    isAvailable 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <ShoppingBag size={18} />
                  {isAvailable ? 'Add to Bag' : 'Sold Out'}
                </button>
                
                <div className="flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 pt-2">
                  <span className="flex items-center gap-1.5"><Truck size={14} /> Fast Delivery</span>
                  <span className="flex items-center gap-1.5"><Shield size={14} /> Secure Checkout</span>
                </div>
              </div>

              <div className="pt-8 space-y-0">
                <Accordion id="details" title="Product Details">
                   <div dangerouslySetInnerHTML={{ __html: descriptionHtml || description }} />
                </Accordion>
                <Accordion id="shipping" title="Shipping & Returns">
                  <p>Enjoy free standard shipping on all orders over $200. Returns are accepted within 30 days of purchase for a full refund or store credit.</p>
                </Accordion>
                <Accordion id="composition" title="Materials & Care">
                  <p>100% Premium Cotton. Machine wash cold with like colors. Tumble dry low. Do not bleach.</p>
                </Accordion>
              </div>

          </div>
        </div>
      </div>

      {/* Floating Bottom Bar Mobile CTA */}
      <div 
        className={`fixed bottom-20 inset-x-4 z-[45] bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl px-4 py-3 md:hidden flex items-center gap-4 shadow-2xl transition-all duration-300 transform ${
          isScrolledPastCTA ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{title}</p>
          <p className="text-sm font-bold text-gray-900">{formattedPrice}</p>
        </div>
        <button
          onClick={() => isAvailable && onAddToCart(product, selectedVariantId)}
          disabled={!isAvailable}
          className="flex-1 bg-black text-white py-3 rounded-lg font-bold text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2"
        >
          <ShoppingBag size={16} /> Add to Bag
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
