import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Article } from '@/types'

export default function ArticleDetail({ id }: { id: string }) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then(res => res.json())
      .then(data => {
        setArticle(data)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!article) return <div>Article not found</div>

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      <div className="prose lg:prose-xl">
        {article.content.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <div className="grid gap-4 mt-8">
        {article.images.map((image, i) => (
          <figure key={i} className="relative h-96">
            <Image 
              src={image.url}
              alt={image.caption}
              fill
              className="object-cover"
            />
            {image.caption && (
              <figcaption className="mt-2 text-sm text-gray-600">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </article>
  )
}