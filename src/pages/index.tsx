import { useEffect, useState } from 'react';
import ArticleDetail from '../components/ArticleDetail';

export default function Home() {
  const [articles, setArticles] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        setArticles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">Brutalist Architecture News</h1>
      {articles.length === 0 ? (
        <div>No articles found</div>
      ) : (
        <div className="grid gap-8">
          {articles.map(article => (
            <ArticleDetail key={article.url} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}