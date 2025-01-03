import ArticleDetail from '@/components/ArticleDetail'

export default function ArticlePage({ params }: { params: { id: string } }) {
  return <ArticleDetail id={params.id} />
}