import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { ContentProcessor } from '../services/ContentProcessor';
import { Article, TransformationHistory } from '../models';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();
const processor = new ContentProcessor();

// Article Management Endpoints
router.post('/articles', 
  authenticate, 
  authorize('editor', 'admin'),
  validateRequest,
  async (req, res) => {
    try {
      const { url, source } = req.body;
      const article = await processor.processArticle(url, source);
      
      res.status(201).json({
        message: 'Article processed successfully',
        article: {
          id: article._id,
          title: article.title,
          status: article.status,
          url: article.sourceUrl
        }
      });
    } catch (error) {
      res.status(500).json({
        error: {
          message: 'Article processing failed',
          details: error.message
        }
      });
    }
  }
);

// ... rest of the implementation ...