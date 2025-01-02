import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types';

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="rounded-lg overflow-hidden shadow-lg bg-white">
      {article.images[0] && (
        <div className="relative h-64">
          <Image
            src={article.images[0].url}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
        <p className="text-gray-600 mb-4">
          {article.content.substring(0, 150)}...
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{article.source}</span>
          <time>{new Date(article.date).toLocaleDateString()}</time>
        </div>
      </div>
    </article>
  );
}