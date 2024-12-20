import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const FeaturedProjects = () => {
  const featuredProjects = [
    {
      title: "Brutalist Museum Extension",
      location: "Berlin, Germany",
      architect: "Studio Concrete",
      description: "A bold extension that celebrates raw materials and geometric forms...",
      imageUrl: "/api/placeholder/800/400"
    },
    {
      title: "Urban Concrete Housing",
      location: "Tokyo, Japan",
      architect: "Minimal Works",
      description: "Sustainable urban living through brutalist principles...",
      imageUrl: "/api/placeholder/800/400"
    }
  ];

  return (
    <section className="py-8">
      <h2 className="font-mono text-2xl font-bold mb-6">FEATURED_PROJECTS</h2>
      <ScrollArea className="h-[600px]">
        <div className="grid gap-8">
          {featuredProjects.map((project, index) => (
            <Card key={index} className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <CardTitle className="font-mono text-xl">{project.title}</CardTitle>
                <CardDescription className="font-mono text-zinc-400">
                  {project.location} | {project.architect}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-64 object-cover mb-4"
                />
                <p className="font-mono text-sm">{project.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
};

export default FeaturedProjects;