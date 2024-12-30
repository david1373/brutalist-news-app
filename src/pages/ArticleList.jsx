import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getArticles } from '@/api/articles';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const trendingTopics = [
    'Brutalism',
    'Concrete Architecture',
    'Urban Megastructures',
    'Brutalist Interiors',
    'Adaptive Reuse of Brutalist Buildings'
  ];

  useEffect(() => {
    async function loadArticles() {
      try {
        console.log('Fetching articles...');
        const data = await getArticles();
        console.log('Articles received:', data);
        setArticles(data);
      } catch (err) {
        console.error('Error loading articles:', err);
        setError('Failed to load articles');
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Articles */}
        <div className="lg:col-span-2">
          <h2 className="mb-6 text-2xl font-bold">Latest Articles</h2>
          {loading ? (
            <div className="text-center py-8">Loading articles...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8">No articles found</div>
          ) : (
            <div className="space-y-8">
              {articles.map((article) => (
                <Link to={`/article/${article.id}`} key={article.id}>
                  <div className="overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-shadow">
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
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-zinc-500">
                          {new Date(article.published_date || article.created_at).toLocaleDateString()}
                        </p>
                        {article.author && (
                          <p className="text-sm text-zinc-500">By {article.author}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <h2 className="mb-6 text-2xl font-bold">Trending Topics</h2>
          <div className="space-y-2">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="bg-white shadow-sm rounded-lg">
                <div className="flex min-h-[52px] items-center px-6">
                  <p className="text-zinc-600">{topic}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="mt-8 rounded-lg border bg-white p-8">
            <h3 className="text-xl font-bold mb-2">Subscribe to Our Newsletter</h3>
            <p className="mb-6 text-sm text-zinc-600">
              Stay updated with the latest in architecture and design
            </p>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border-zinc-200 text-sm text-zinc-600"
              />
              <Button className="w-full bg-black text-sm hover:bg-black/90">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ArticleList;