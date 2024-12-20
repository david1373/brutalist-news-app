import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

export const OptimizedImage = ({ 
  src, 
  alt, 
  sizes = '100vw',
  className = '' 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '50px 0px'
  });
  
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {inView && (
        <picture>
          <source
            type="image/webp"
            srcSet={`${src}?format=webp&w=400 400w,
                    ${src}?format=webp&w=800 800w,
                    ${src}?format=webp&w=1200 1200w`}
            sizes={sizes}
          />
          <img
            src={`${src}?w=800`}
            alt={alt}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsLoaded(true)}
            loading="lazy"
            decoding="async"
          />
        </picture>
      )}
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
      )}
    </div>
  );
};