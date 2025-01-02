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
        const response = await axios.get(`http://localhost:3001/api/articles/${id}`);
        console.log('Article data:', response.data);
        setArticle(response.data);
      } catch (err) {
        console.error('Error details:', err);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading article...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!article) return <div className="text-center py-8">Article not found</div>;

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Card className="overflow-hidden">
          {article.featured_image && (
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-96 object-cover"
            />
          )}
          <div className="p-6">
            <div className="mb-4">
              <span className="inline-block rounded bg-black px-2 py-1 text-xs text-white">
                {article.source_name}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center space-x-4 mb-6 text-sm text-zinc-500">
              {article.author && <span>By {article.author}</span>}
              <span>{new Date(article.published_date || article.created_at).toLocaleDateString()}</span>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.original_content || 'Pending content fetch' }} />
            </div>
            
            {article.transformed_content && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold mb-4">Kerouac's Take</h2>
                <div className="prose prose-lg max-w-none italic">
                  <div dangerouslySetInnerHTML={{ __html: article.transformed_content }} />
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-zinc-500 mb-4">Content from {article.source_name}</p>
              <a 
                href={article.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-black hover:underline"
              >
                Read original article
              </a>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ArticleDetail;