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
      .then(setArticles)
      .catch(console.error);
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">Brutalist Architecture News</h1>
      <div className="space-y-8">
        {articles?.map(article => (
          <ArticleDetail key={article.url} article={article} />
        ))}
      </div>
    </div>
  );
}