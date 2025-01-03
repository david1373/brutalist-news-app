import Image from 'next/image'
import Link from 'next/link'
import { Article } from '@/types'

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.id}`}>
      <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        {article.images[0] && (
          <div className="relative h-48">
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
          <p className="text-gray-600">{article.content.substring(0, 150)}...</p>
        </div>
      </article>
    </Link>
  )
}