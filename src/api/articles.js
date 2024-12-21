import axios from 'axios';

export async function getArticles() {
  try {
    const response = await axios.get('/api/articles');
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}