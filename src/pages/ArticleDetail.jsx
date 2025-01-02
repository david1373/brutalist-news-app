import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card } from '@/components/ui/card';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`/api/articles/${id}`);
        setArticle(response.data);
      } catch (err) {
        setError('Failed to load article');
        console.error('Error loading article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <div className="py-8 text-center">Loading article...</div>;
  if (error) return <div className="py-8 text-center text-red-500">{error}</div>;
  if (!article) return <div className="py-8 text-center">Article not found</div>;

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Card className="overflow-hidden">
          {article.featured_image && (
            <img
              src={article.featured_image}
              alt={article.title}
              className="h-96 w-full object-cover"
            />
          )}
          <div className="p-6">
            <div className="mb-4">
              <span className="inline-block rounded bg-black px-2 py-1 text-xs text-white">
                {article.source_name}
              </span>
            </div>
            <h1 className="mb-4 text-3xl font-bold">{article.title}</h1>
            <div className="mb-6 flex items-center space-x-4 text-sm text-zinc-500">
              {article.author && <span>By {article.author}</span>}
              <span>
                {new Date(article.published_date || article.created_at).toLocaleDateString()}
              </span>
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:underline"
              >
                Original Source
              </a>
            </div>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ArticleDetail;
