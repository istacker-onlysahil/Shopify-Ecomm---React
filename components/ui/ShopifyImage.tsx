
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
const getOptimizedImageUrl = (src: string, width: number, crop?: string) => {
  if (!src) return '';
  
  try {
    const url = new URL(src);
    
    // 1. Handle Unsplash URLs (For Demo Data)
    if (url.hostname.includes('unsplash.com')) {
      url.searchParams.set('w', width.toString());
      url.searchParams.set('q', '75'); // Quality
      url.searchParams.set('auto', 'format'); // WebP/AVIF
      url.searchParams.set('fit', 'crop');
      return url.toString();
    }

    // 2. Handle Shopify CDN URLs
    // Shopify format: ?width=500&format=auto
    if (url.hostname.includes('cdn.shopify.com')) {
      url.searchParams.set('width', width.toString());
      url.searchParams.set('format', 'auto'); 
      // Use webp/avif automatically via 'auto'
      url.searchParams.set('quality', '75');
      if (crop) {
        url.searchParams.set('crop', crop);
      }
      return url.toString();
    }
    
    // Return original if not recognized CDN
    return src;
  } catch (e) {
    // Fallback for relative paths or invalid URLs
    return src;
  }
};

export const ShopifyImage: React.FC<ShopifyImageProps> = ({
  src,
  alt,
  width,
  height,
  sizes = '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw', // Default responsive guess
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

  // FIX: Check if image is already cached/complete
  // This solves the issue where cached images don't trigger onLoad
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, [src]);

  if (!src) return <div className={`bg-gray-100 flex items-center justify-center ${className}`}><ImageOff className="text-gray-300" size={24} /></div>;

  // Optimized widths for Shopify CDN Cache hits. 
  // Includes standard mobile sizes (165, 360) to prevent fetching 600px+ images on small screens.
  const targetWidths = [165, 360, 533, 720, 940, 1066, 1280, 1500, 1920, 2560];

  // If error occurred, don't use optimized URLs, try raw src
  const srcSet = hasError 
    ? undefined 
    : targetWidths
        .map((w) => {
          const url = getOptimizedImageUrl(src, w, crop);
          return `${url} ${w}w`;
        })
        .join(', ');

  // Generate a fallback src (usually a middle-ground size)
  const defaultSrc = hasError ? src : getOptimizedImageUrl(src, 600, crop);

  // PERFORMANCE: If priority is true, or loaded, show immediately.
  const shouldShowImmediately = priority || isLoaded || hasError;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton / Placeholder behind image */}
      {!shouldShowImmediately && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      
      <img
        ref={imgRef}
        src={defaultSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${
           shouldShowImmediately ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true); // Force visibility to show browser's broken image icon or fallback
        }}
        {...props}
      />
    </div>
  );
};
