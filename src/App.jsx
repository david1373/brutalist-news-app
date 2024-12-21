import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const App = () => {
  const featuredArticle = {
    title: 'Trahan Architects creates "weightless" hand-bent steel pavilion in Arkansas',
    category: 'Architecture',
    content: 'New Orleans architecture studio Trahan Architects has completed a performance pavilion made of weathering steel that is anchored by two ground points, making the structure appear lighter than it is. The Performance Pavilion is located in the centre of a large lawn at Luther George Park in Springdale, Arkansas, designed in...',
    date: 'Fri. 20 Dec 2024 20:00:33 +0000',
    imageUrl: '/api/placeholder/800/400'
  };

  const trendingTopics = [
    'Brutalism',
    'Concrete Architecture',
    'Urban Megastructures',
    'Brutalist Interiors',
    'Adaptive Reuse of Brutalist Buildings'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
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
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Featured Articles */}
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-2xl font-bold">Featured Articles</h2>
            <Card className="overflow-hidden">
              <img 
                src={featuredArticle.imageUrl} 
                alt="Featured article" 
                className="h-[400px] w-full object-cover"
              />
              <CardHeader>
                <div className="rounded bg-black px-2 py-1 text-xs text-white w-fit">
                  {featuredArticle.category}
                </div>
                <h3 className="mt-2 text-xl font-bold">{featuredArticle.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600">{featuredArticle.content}</p>
                <p className="mt-4 text-sm text-zinc-500">{featuredArticle.date}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <h2 className="mb-6 text-2xl font-bold">Trending Topics</h2>
            <div className="space-y-4">
              {trendingTopics.map((topic, index) => (
                <Card key={index} className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                  <CardContent className="flex min-h-[60px] items-center p-4 pl-6">
                    <p className="text-zinc-600">{topic}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Newsletter */}
            <Card className="mt-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Subscribe to Our Newsletter</h3>
                <p className="mb-4 text-zinc-600">
                  Stay updated with the latest in architecture and design
                </p>
                <div className="space-y-4">
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full text-zinc-600"
                  />
                  <Button className="w-full bg-black hover:bg-black/90">Subscribe</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
