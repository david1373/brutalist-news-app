import { useEffect, useState } from 'react';
import ArticleDetail from '@/components/ArticleDetail';

interface Article {
  title: string;
  content: string;
  images: { url: string; caption: string }[];
  source: string;
  url: string;
  date: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched data:', data);
        setArticles(data.articles || []);
      })
      .catch(console.error);
  }, []);

  console.log('Current articles:', articles);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">Brutalist Architecture News</h1>
      <div className="space-y-8">
        {Array.isArray(articles) && articles.map(article => (
          <ArticleDetail key={article.url} article={article} />
        ))}
      </div>
    </div>
  );
}