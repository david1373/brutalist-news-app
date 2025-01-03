import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Article } from '@/types'

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        setArticles(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map(article => (
        <Link 
          key={article.id} 
          href={`/articles/${article.id}`}
          className="block hover:shadow-lg transition-shadow"
        >
          <article className="border rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">{article.title}</h2>
            <p className="text-gray-600">{article.content.substring(0, 150)}...</p>
          </article>
        </Link>
      ))}
    </div>
  )
}