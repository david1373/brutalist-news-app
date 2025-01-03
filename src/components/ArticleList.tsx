'use client';

import { useEffect, useState } from 'react';
import ArticleCard from './ArticleCard';
import type { Article } from '@/types';

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  
  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(setArticles);
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}