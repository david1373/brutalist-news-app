interface Article {
  title: string;
  content: string;
  images: { url: string; caption: string }[];
  source: string;
  url: string;
  date: string;
}

export default function ArticleDetail({ article }: { article: Article }) {
  return (
    <article className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{article.title}</h2>
      <p className="mb-4">{article.content}</p>
      <div className="text-gray-600">
        <p>Source: {article.source}</p>
        <p>Date: {new Date(article.date).toLocaleDateString()}</p>
      </div>
    </article>
  );
}