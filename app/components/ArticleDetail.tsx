import React from 'react';
import Image from 'next/image';

const ArticleDetail = ({ article }) => {
  const paragraphs = article.content.split('\n\n').filter(p => p.trim());
  const imageCount = article.images.length;
  const spacing = Math.max(2, Math.floor(paragraphs.length / (imageCount + 1)));
  
  const content = [];
  let imageIndex = 0;
  
  paragraphs.forEach((paragraph, index) => {
    content.push(
      <p key={`p-${index}`} className="mb-6 text-lg">
        {paragraph}
      </p>
    );

    if (imageIndex < imageCount && index % spacing === spacing - 1) {
      const image = article.images[imageIndex];
      content.push(
        <figure key={`img-${imageIndex}`} className="my-12">
          <div className="relative w-full h-[600px]">
            <Image
              src={image.url}
              alt={image.caption}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw"
            />
          </div>
          <figcaption className="mt-3 text-sm text-gray-600">
            {image.caption} {image.credit && `| Credit: ${image.credit}`}
          </figcaption>
        </figure>
      );
      imageIndex++;
    }
  });

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{article.title}</h1>
      {content}
    </article>
  );
};

export default ArticleDetail;