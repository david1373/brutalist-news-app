import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Articles from '@/components/Articles';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const trendingTopics = [
    'Brutalism',
    'Concrete Architecture',
    'Urban Megastructures',
    'Brutalist Interiors',
    'Adaptive Reuse of Brutalist Buildings'
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto max-w-[1200px] flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold">Brutalist</h1>
          <nav className="space-x-6 text-zinc-600">
            <a href="#" className="text-sm">Home</a>
            <a href="#" className="text-sm">Categories</a>
            <a href="#" className="text-sm">Shop</a>
            <a href="#" className="text-sm">Admin</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Articles */}
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-2xl font-bold">Latest Articles</h2>
            {loading ? (
              <div className="text-center py-8">Loading articles...</div>
            ) : (
              <Articles articles={articles} />
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
    </div>
  );
};

export default App;
