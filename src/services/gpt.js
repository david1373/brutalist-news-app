import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function rewriteArticle(content) {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{
        role: 'system',
        content: 'Rewrite the following architecture article in Jack Kerouac\'s style while maintaining accuracy of architectural terminology and concepts.'
      }, {
        role: 'user',
        content: content
      }],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error rewriting article:', error);
    return content; // Fall back to original content if rewrite fails
  }
}