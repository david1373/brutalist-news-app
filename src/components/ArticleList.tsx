import ArticleCard from './ArticleCard';
import { Article } from '@/types';

export default function ArticleList({ articles }: { articles: Article[] }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {articles.map(article => (
        <ArticleCard key={article.url} article={article} />
      ))}
    </div>
  );
}