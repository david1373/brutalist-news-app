import React from 'react';
import Image from 'next/image';

interface ArticleDetailProps {
  article: {
    title: string;
    content: string;
    images: Array<{
      url: string;
      caption: string;
      credit: string;
    }>;
  };
}

const ArticleDetail = ({ article }: ArticleDetailProps) => {
  // Split content into paragraphs and intersperse images
  const contentParagraphs = article.content.split('\n\n');
  const imagesPerSegment = Math.ceil(article.images.length / contentParagraphs.length);
  
  return (
    <article className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">{article.title}</h1>
      {contentParagraphs.map((paragraph, index) => (
        <div key={index} className="mb-8">
          <p className="mb-4">{paragraph}</p>
          {article.images.slice(
            index * imagesPerSegment,
            (index + 1) * imagesPerSegment
          ).map((image, imgIndex) => (
            <figure key={imgIndex} className="my-6">
              <div className="relative h-96 w-full">
                <Image
                  src={image.url}
                  alt={image.caption}
                  fill
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-2 text-sm text-gray-600">
                {image.caption} | Credit: {image.credit}
              </figcaption>
            </figure>
          ))}
        </div>
      ))}
    </article>
  );
};

export default ArticleDetail;