import React, { useRef, useMemo } from 'react';
import { useVirtualizedList } from '../hooks/useVirtualization';
import { OptimizedImage } from './ImageOptimizer';
import { Card } from '@/components/ui/card';

export const ArticleListOptimized = ({ articles }) => {
  const parentRef = useRef(null);
  
  const rowVirtualizer = useVirtualizedList(
    articles.length,
    parentRef
  );

  const memoizedArticles = useMemo(() => articles, [articles]);

  return (
    <div 
      ref={parentRef} 
      className="h-[calc(100vh-12rem)] overflow-auto"
      style={{
        contain: 'strict'
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {rowVirtualizer.virtualItems.map((virtualRow) => {
          const article = memoizedArticles[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`
              }}
            >
              <ArticleCard article={article} />
            </div>
          );
        })}
      </div>
    </div>
  );
};