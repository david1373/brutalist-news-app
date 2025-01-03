import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types';

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.id}`} className="block">
      <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-all">
        {article.images[0] && (
          <div className="relative aspect-video">
            <Image 
              src={article.images[0].url}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{article.title}</h2>
          <p className="text-gray-600 line-clamp-3">{article.content}</p>
          <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
            <span>{article.source}</span>
            <time>{new Date(article.date).toLocaleDateString()}</time>
          </div>
        </div>
      </article>
    </Link>
  );
}