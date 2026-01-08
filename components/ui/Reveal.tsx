
import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  width?: 'fit-content' | '100%';
  className?: string;
  delay?: number;
  threshold?: number;
}

export const Reveal: React.FC<RevealProps> = ({ 
  children, 
  width = '100%', 
  className = "", 
  delay = 0,
  threshold = 0.01 // Reduced threshold for easier triggering
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Capture ref for cleanup
    const currentRef = ref.current;
    
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        setIsVisible(true);
        return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (currentRef) {
            observer.unobserve(currentRef);
          }
        }
      },
      {
        root: null,
        // Removed negative margin which might prevent items at bottom edge from appearing
        rootMargin: '0px', 
        threshold: threshold,
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return (
    <div 
      ref={ref} 
      className={`${className} will-change-transform ${isVisible ? 'animate-blur-in' : 'opacity-0 translate-y-[20px]'}`}
      style={{ 
        width, 
        animationDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};
