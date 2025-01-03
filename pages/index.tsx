import { useEffect, useState } from 'react';
import ArticleDetail from '../components/ArticleDetail';

export default function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => setArticles(data));
  }, []);

  return (
    <main className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">Brutalist Architecture News</h1>
      <div className="grid gap-8">
        {articles.map(article => (
          <ArticleDetail key={article.url} article={article} />
        ))}
      </div>
    </main>
  );
}