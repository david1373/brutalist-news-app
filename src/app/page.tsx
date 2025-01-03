import { ArticleList } from '@/components/ArticleList'

export default function Home() {
  return (
    <main className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">Brutalist Architecture News</h1>
      <ArticleList />
    </main>
  )
}