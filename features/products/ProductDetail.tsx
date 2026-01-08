
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ArrowLeft, ShoppingBag, Truck, Shield, ChevronDown, ChevronUp, Share2, Heart } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { ShopifyProduct, TransitionRect } from '../../types/index';
import { Reveal } from '../../components/ui/Reveal';
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
  
  // Animation States
  const [isAnimating, setIsAnimating] = useState(!!originRect);
  // New state: Controls when the real content (TEXT ONLY) becomes visible
  // If no originRect (direct load), show content immediately (true). If animating, start hidden (false).
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

  // --- Scroll Lock during Animation ---
  useEffect(() => {
    if (isAnimating) {
      document.body.style.overflow = 'hidden';
      // Prevent momentum scrolling on mobile
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
    // 1. Force Scroll to Top Immediately (Instant)
    window.scrollTo({ top: 0, behavior: 'auto' });

    // If no origin, skip animation
    if (!originRect) return;

    // 2. Initial State: Set ghost image to fixed position matching the card's original position
    setAnimStyle({
      position: 'fixed',
      top: originRect.top,
      left: originRect.left,
      width: originRect.width,
      height: originRect.height,
      zIndex: 9999, // Fly OVER the global navbar
      borderRadius: '0.75rem', 
      transition: 'none',
      objectFit: 'cover'
    });

    // 3. Animate to Destination
    const frameId = requestAnimationFrame(() => {
       requestAnimationFrame(() => {
          if (!placeholderRef.current) return;
          const destRect = placeholderRef.current.getBoundingClientRect();

          // Enable transition and set new coordinates
          setAnimStyle({
            position: 'fixed',
            top: destRect.top,
            left: destRect.left,
            width: destRect.width,
            height: destRect.height,
            zIndex: 9999,
            borderRadius: '1rem', // Always rounded-2xl for consistency
            // OPTIMIZATION: Super fast transition (0.3s)
            transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)', 
            objectFit: 'cover'
          });
          
          // 4. Reveal TEXT Content immediately (in parallel with image flight)
          const revealTimeout = setTimeout(() => {
             setShowRealContent(true);
          }, 30); // 30ms delay just to let the paint finish, effectively instant

          // 5. Cleanup: Remove ghost with a buffer
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

  // PREPARE GHOST IMAGE
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
      
      {/* Ghost Image for Animation */}
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

      {/* Main Content - Added px-4 pt-4 on mobile to keep image inside page width */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-4 md:pt-12 pb-24">
        
        {/* Back Button (Desktop Only) */}
        <div className={`hidden md:block transition-opacity duration-300 ${!showRealContent ? 'opacity-0' : 'opacity-100'}`}>
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-10 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to collection
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-0">
          
          <div className="lg:col-span-7 space-y-4">
              {/* 
                 Main Image Container
                 CRITICAL FIX: Removed 'opacity' toggle. 
                 This container is now ALWAYS visible (opacity-100).
                 It sits BEHIND the ghost image during animation.
                 This guarantees that when the ghost is removed, the image is ALREADY PAINTED.
              */}
              <div 
                ref={placeholderRef}
                className="relative bg-gray-50 overflow-hidden rounded-2xl opacity-100"
              >
                {/* Mobile: Swiper Slider */}
                <div className="block md:hidden">
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={0}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        className="aspect-[3/4] w-full"
                    >
                        {allImages.map((img, idx) => (
                            <SwiperSlide key={idx}>
                                <ShopifyImage 
                                    src={img.url} 
                                    alt={img.altText || title}
                                    priority={idx === 0} 
                                    sizes="100vw"
                                    className="w-full h-full object-cover object-center"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Desktop: Single Image View */}
                <div className="hidden md:block aspect-[4/5]">
                     <ShopifyImage 
                        src={selectedImage} 
                        alt={title}
                        priority={true}
                        // Oversample slightly (60vw) to ensure crispness on high DPI screens
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                <button className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg md:hidden z-10">
                  <Heart size={20} />
                </button>
              </div>
            
            {/* Desktop Thumbnails - Rounded XL */}
            <div className={`hidden md:block transition-all duration-300 ${!showRealContent ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                {allImages.length > 1 && (
                    <div className="flex gap-3 px-4 md:px-0 overflow-x-auto no-scrollbar py-2">
                    {allImages.map((img, idx) => (
                        <button 
                        key={idx}
                        onClick={() => setSelectedImage(img.url)}
                        className={`flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                            selectedImage === img.url ? 'border-black shadow-md scale-105' : 'border-transparent opacity-60'
                        }`}
                        >
                        <ShopifyImage 
                            src={img.url} 
                            alt=""
                            width={100}
                            className="w-full h-full object-cover" 
                        />
                        </button>
                    ))}
                    </div>
                )}
            </div>
          </div>

          <div className={`lg:col-span-5 pt-6 lg:pt-0 lg:sticky lg:top-32 h-fit space-y-8 transition-all duration-300 ease-out ${!showRealContent ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
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

      <div 
        className={`fixed bottom-0 inset-x-0 z-[45] bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-4 md:hidden flex items-center gap-4 transition-all duration-300 transform ${
          isScrolledPastCTA ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{title}</p>
          <p className="text-sm font-bold text-gray-900">{formattedPrice}</p>
        </div>
        <button
          onClick={() => isAvailable && onAddToCart(product, selectedVariantId)}
          disabled={!isAvailable}
          className="flex-1 bg-black text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
        >
          <ShoppingBag size={16} /> Add to Bag
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
