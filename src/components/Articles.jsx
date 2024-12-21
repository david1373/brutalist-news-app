import React from 'react';
import { Card } from '@/components/ui/card';

const Articles = ({ articles }) => {
  if (!articles?.length) {
    return <div className="text-center py-8">No articles found</div>;
  }

  return (
    <div className="space-y-8">
      {articles.map((article) => (
        <div key={article.id} className="overflow-hidden rounded-lg bg-white shadow">
          {article.featured_image && (
            <img 
              src={article.featured_image} 
              alt={article.title} 
              className="h-[400px] w-full object-cover"
            />
          )}
          <div className="p-6">
            <div className="mb-4">
              <div className="inline-block rounded bg-black px-2 py-1 text-xs text-white">
                {article.source_name}
              </div>
            </div>
            <h3 className="mb-4 text-xl font-bold">{article.title}</h3>
            <p className="mb-4 text-zinc-600">
              {article.transformed_content || article.original_content.slice(0, 300)}...
            </p>
            <div className="flex justify-between items-center">
              <p className="text-sm text-zinc-500">{new Date(article.published_date).toLocaleDateString()}</p>
              {article.author && <p className="text-sm text-zinc-500">By {article.author}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Articles;
