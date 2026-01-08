
import React, { useState, useEffect, useRef } from 'react';
import { ImageOff } from 'lucide-react';

interface ShopifyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number; // Intrinsic width (optional but recommended for layout stability)
  height?: number; // Intrinsic height
  sizes?: string; // Standard HTML sizes attribute
  priority?: boolean; // If true, sets loading="eager" (good for LCP)
  className?: string;
  crop?: 'top' | 'bottom' | 'center' | 'left' | 'right'; // Optional cropping
}

/**
 * UTILITY: Appends size parameters to URL.
 * Supports Shopify CDN and Unsplash (for demo data compatibility).
 */
export const getOptimizedImageUrl = (src: string, width: number, crop?: string) => {
  if (!src) return '';
  
  try {
    const url = new URL(src);
    
    // 1. Handle Unsplash URLs (For Demo Data)
    if (url.hostname.includes('unsplash.com')) {
      url.searchParams.set('w', width.toString());
      url.searchParams.set('q', '80'); 
      url.searchParams.set('auto', 'format'); 
      url.searchParams.set('fit', 'crop');
      return url.toString();
    }

    // 2. Handle Shopify CDN URLs
    if (url.hostname.includes('cdn.shopify.com')) {
      url.searchParams.set('width', width.toString());
      url.searchParams.set('format', 'auto'); 
      url.searchParams.set('quality', '80');
      if (crop) {
        url.searchParams.set('crop', crop);
      }
      return url.toString();
    }
    
    // Return original if not recognized CDN
    return src;
  } catch (e) {
    return src;
  }
};

export const ShopifyImage: React.FC<ShopifyImageProps> = ({
  src,
  alt,
  width,
  height,
  sizes = '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw', 
  priority = false,
  className = '',
  crop,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // Check if image is already cached/complete
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, [src]);

  if (!src) return <div className={`bg-gray-100 flex items-center justify-center ${className}`}><ImageOff className="text-gray-300" size={24} /></div>;

  // 1. Generate High-Res SrcSet
  const targetWidths = [165, 360, 533, 720, 940, 1066, 1280, 1500, 1920, 2560];
  const srcSet = hasError 
    ? undefined 
    : targetWidths
        .map((w) => {
          const url = getOptimizedImageUrl(src, w, crop);
          return `${url} ${w}w`;
        })
        .join(', ');

  const highResSrc = hasError ? src : getOptimizedImageUrl(src, 600, crop);

  // 2. Generate Low-Res Placeholder (20px width)
  // This downloads instantly and acts as the "blur base"
  const placeholderSrc = hasError ? null : getOptimizedImageUrl(src, 20, crop);

  // If we couldn't optimize the URL (it returned the original), don't show the placeholder
  // to prevent double downloading the heavy image.
  const showPlaceholder = placeholderSrc && placeholderSrc !== src;

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      
      {/* 
         LAYER 1: The "Blur Up" Placeholder
         - Fetches a tiny 20px image.
         - Scales it up 110% to hide blurred edges.
         - Blurs it heavily.
         - Stays visible until high-res loads.
      */}
      {showPlaceholder && !hasError && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover filter blur-xl scale-110 transition-opacity duration-700 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}
      
      {/* 
         LAYER 2: The High Quality Image
         - Loads on top.
         - Transitions opacity from 0 to 100 when loaded.
      */}
      <img
        ref={imgRef}
        src={highResSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        className={`w-full h-full object-cover relative z-10 transition-opacity duration-700 ease-out ${
           isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true); 
        }}
        {...props}
      />
    </div>
  );
};
