import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const NewsApp = () => {
  const mockArticles = [
    {
      title: "Concrete Villa Emerges from Coastal Cliff",
      source: "Architecture Daily",
      content: "Raw concrete forms merge with natural rock formations...",
      imageUrl: "/api/placeholder/800/400",
      attribution: "© John Architect 2024"
    },
    {
      title: "Minimalist Japanese House Redefines Urban Living",
      source: "Design Chronicle",
      content: "Stripped back to essential elements, this house...",
      imageUrl: "/api/placeholder/800/400",
      attribution: "© Jane Designer 2024"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-4">
      <header className="mb-8 border-b border-zinc-800 pb-4">
        <h1 className="font-mono text-4xl font-bold tracking-tighter">BRUTALIST_NEWS</h1>
        <p className="font-mono text-zinc-400 mt-2">Architecture & Design / AI-Transformed</p>
      </header>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid gap-6 md:grid-cols-2">
          {mockArticles.map((article, index) => (
            <Card key={index} className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <CardTitle className="font-mono text-xl">{article.title}</CardTitle>
                <CardDescription className="font-mono text-zinc-400">
                  {article.source}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-48 object-cover mb-4"
                />
                <p className="font-mono text-sm mb-2">{article.content}</p>
                <p className="text-xs text-zinc-500">{article.attribution}</p>
                <Button variant="outline" className="mt-4 font-mono">
                  READ_MORE
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NewsApp;