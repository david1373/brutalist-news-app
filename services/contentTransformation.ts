import { Configuration, OpenAIApi } from 'openai';
import { Article } from '../types/Article';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export class ContentTransformer {
  private openai: OpenAIApi;
  
  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async transformContent(article: Article): Promise<string> {
    let attempts = 0;
    let lastError: Error | null = null;

    while (attempts < MAX_RETRIES) {
      try {
        const response = await this.openai.createChatCompletion({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an expert in architecture and design who writes in Jack Kerouac's style. Maintain technical accuracy while capturing Kerouac's spontaneous prose style."
            },
            {
              role: "user",
              content: `Transform this architecture article while preserving all technical details and terminology: ${article.content}`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        });

        const transformedContent = response.data.choices[0]?.message?.content;
        if (!transformedContent) {
          throw new Error('No content returned from GPT');
        }

        // Validate technical terms are preserved
        const technicalTerms = this.extractTechnicalTerms(article.content);
        const preservedTerms = this.validateTechnicalTerms(transformedContent, technicalTerms);
        
        if (!preservedTerms) {
          throw new Error('Technical terms not preserved');
        }

        return transformedContent;

      } catch (error) {
        lastError = error as Error;
        attempts++;
        if (attempts < MAX_RETRIES) {
          await this.sleep(RETRY_DELAY * attempts);
        }
      }
    }

    throw new Error(`Failed to transform content after ${MAX_RETRIES} attempts: ${lastError?.message}`);
  }

  private extractTechnicalTerms(content: string): Set<string> {
    // Add your architectural terms dictionary/detection logic here
    const terms = new Set<string>();
    // Example implementation
    const architecturalTerms = [
      'façade', 'cantilever', 'fenestration', 'massing',
      'brutalist', 'modernist', 'ceiling height', 'floor plan'
    ];
    
    for (const term of architecturalTerms) {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        terms.add(term);
      }
    }
    return terms;
  }

  private validateTechnicalTerms(transformed: string, terms: Set<string>): boolean {
    for (const term of terms) {
      if (!transformed.toLowerCase().includes(term.toLowerCase())) {
        return false;
      }
    }
    return true;
  }
}

export default new ContentTransformer();