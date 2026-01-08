
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
  threshold = 0.05 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -20px 0px', 
        threshold: threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return (
    <div 
      ref={ref} 
      // Initial state updated to translate-y-[40px] to match the 0% keyframe
      className={`${className} ${isVisible ? 'animate-blur-in' : 'opacity-0 translate-y-[40px]'}`}
      style={{ 
        width, 
        animationDelay: `${delay}ms`,
        willChange: 'opacity, filter, transform'
      }}
    >
      {children}
    </div>
  );
};
