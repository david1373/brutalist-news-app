'use client';

import { useEffect, useState } from 'react';
import { Article } from '@/types';
import { ArticleCard } from './ArticleCard';

export function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(setArticles)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading articles...</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}