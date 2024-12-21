import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const App = () => {
  const featuredArticle = {
    title: 'I/Thee places seating within "intentionally eroded" earthen walls for Iowa park',
    category: 'Architecture',
    content: 'Arizona architecture studio I/Thee has created a public installation in an Iowa park composed of furniture affixed into two rammed earth walls that were made to look eroded by applying water pressure. The Dining Room is the first of six pavilions planned to encircle Lake Petocka in Bondurant, Iowa for the ARTocka Trail Loop.',
    date: 'Thu, 19 Dec 2024 20:00:40 +0000',
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
          <nav className="space-x-6">
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
                <p className="text-gray-600">{featuredArticle.content}</p>
                <p className="mt-4 text-sm text-gray-500">{featuredArticle.date}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <h2 className="mb-6 text-2xl font-bold">Trending Topics</h2>
            <div className="space-y-4">
              {trendingTopics.map((topic, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <p className="font-medium">{topic}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Newsletter */}
            <Card className="mt-8">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-bold">Subscribe to Our Newsletter</h3>
                <p className="mb-4 text-sm text-gray-600">
                  Stay updated with the latest in architecture and design
                </p>
                <div className="space-y-4">
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full"
                  />
                  <Button className="w-full">Subscribe</Button>
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
