import { useEffect, useState } from 'react'
import { ArticleCard } from './ArticleCard'
import { Article } from '@/types'

export function ArticleList() {
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
        <ArticleCard key={article.url} article={article} />
      ))}
    </div>
  )
}