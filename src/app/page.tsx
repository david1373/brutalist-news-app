'use client';

import { useEffect, useState } from 'react';
import type { Article } from '@/types';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  
  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => setArticles(Array.isArray(data) ? data : []));
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Brutalist Architecture News</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles?.map(article => (
          <article key={article.id} className="border p-4 rounded">
            <h2>{article.title}</h2>
            <p>{article.content}</p>
          </article>
        ))}
      </div>
    </main>
  );
}