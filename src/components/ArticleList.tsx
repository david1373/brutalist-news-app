'use client';

import { useEffect, useState } from 'react';
import { Article } from '@/types';

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        console.log('API response:', data);
        setArticles(Array.isArray(data) ? data : []);
      });
  }, []);

  if (!articles?.length) return <div>Loading articles...</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map(article => (
        <article key={article.id} className="border p-4 rounded-lg">
          <h2 className="text-xl font-bold">{article.title}</h2>
          <p className="mt-2">{article.content}</p>
        </article>
      ))}
    </div>
  );
}