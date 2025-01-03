import { ArticleList } from '@/components/ArticleList'

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Brutalist Architecture News</h1>
      <ArticleList />
    </main>
  )
}