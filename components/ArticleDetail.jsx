import React from 'react';
import Image from 'next/image';

export default function ArticleDetail({ article }) {
  const paragraphs = article.content.split('\n').filter(p => p.trim());
  const imageInterval = Math.max(2, Math.floor(paragraphs.length / (article.images.length + 1)));
  
  const content = [];
  let imageIndex = 0;
  
  paragraphs.forEach((paragraph, index) => {
    // Add paragraph
    if (paragraph.trim()) {
      content.push(
        <p key={`p-${index}`} className="mb-6 text-lg leading-relaxed">
          {paragraph.trim()}
        </p>
      );
    }
    
    // Add image after every few paragraphs
    if (imageIndex < article.images.length && index % imageInterval === 0) {
      const image = article.images[imageIndex];
      content.push(
        <figure key={`img-${imageIndex}`} className="my-12">
          <div className="relative w-full h-[600px]">
            <Image
              src={image.url}
              alt={image.caption || 'Architecture image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw"
            />
          </div>
          {image.caption && (
            <figcaption className="mt-3 text-sm text-gray-600">
              {image.caption}
            </figcaption>
          )}
        </figure>
      );
      imageIndex++;
    }
  });

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-4">Source: {article.source}</span>
          <time>{new Date(article.date).toLocaleDateString()}</time>
        </div>
      </header>
      {content}
    </article>
  );
}