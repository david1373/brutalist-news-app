import { Article, TransformationHistory } from '../models/index';
import { OpenAI } from 'openai';
import cheerio from 'cheerio';
import axios from 'axios';
import { sanitizeHtml } from '../utils/sanitizer';
import { Cache } from '../models/index';

export class ContentProcessor {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async processArticle(url, source) {
    const article = new Article({
      sourceUrl: url,
      source,
      status: 'processing'
    });

    try {
      const rawContent = await this.fetchContent(url);
      const parsedContent = await this.parseContent(rawContent, source);
      
      article.title = parsedContent.title;
      article.originalContent = parsedContent.content;
      article.images = parsedContent.images;
      article.attribution = parsedContent.attribution;
      
      const transformedContent = await this.transformContent(parsedContent.content);
      article.transformedContent = transformedContent;
      
      article.status = 'published';
      await article.save();

      return article;
    } catch (error) {
      article.status = 'error';
      await article.save();
      throw error;
    }
  }

  async fetchContent(url) {
    const cachedContent = await Cache.findOne({ key: url });
    if (cachedContent) {
      return cachedContent.value;
    }

    const response = await axios.get(url);
    const content = response.data;

    await Cache.create({
      key: url,
      value: content,
      expiresAt: new Date(Date.now() + 3600000)
    });

    return content;
  }

  // Rest of the implementation...