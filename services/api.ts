const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const fetchArticles = async () => {
  const response = await fetch(`${API_URL}/api/articles`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const fetchArticle = async (id: string) => {
  const response = await fetch(`${API_URL}/api/articles/${id}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};