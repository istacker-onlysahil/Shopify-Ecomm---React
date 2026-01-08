
import React from 'react';

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
    url.searchParams.set('width', width.toString());
    url.searchParams.set('format', 'auto'); 
    url.searchParams.set('quality', '75');
    if (crop) {
      url.searchParams.set('crop', crop);
    }
    return url.toString();
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
  if (!src) return <div className={`bg-gray-100 ${className}`} />;

  // Generate widths for srcset. 
  const targetWidths = [320, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];

  const srcSet = targetWidths
    .map((w) => {
      const url = getOptimizedImageUrl(src, w, crop);
      return `${url} ${w}w`;
    })
    .join(', ');

  // Generate a fallback src (usually a middle-ground size)
  const defaultSrc = getOptimizedImageUrl(src, 800, crop);

  return (
    <img
      src={defaultSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding={priority ? 'sync' : 'async'}
      className={className}
      {...props}
    />
  );
};
