import { useEffect, useState } from 'react';
import ArticleList from '@/components/ArticleList';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
        setLoading(false);
      });
  }, []);

  return (
    <main className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">Brutalist Architecture News</h1>
      {loading ? (
        <div>Loading articles...</div>
      ) : (
        <ArticleList articles={articles} />
      )}
    </main>
  );
}