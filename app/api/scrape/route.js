import { NextResponse } from 'next/server';
import DezeenScraper from '../../../services/scrapers/dezeen';
import LeibalScraper from '../../../services/scrapers/leibal';
import { rateLimiter } from '../middleware/rateLimit';
import logger from '../../../services/logger';

let isScrapingInProgress = false;

export async function POST(req) {
  try {
    if (isScrapingInProgress) {
      return NextResponse.json({ 
        error: 'Scraping already in progress' 
      }, { status: 429 });
    }

    const body = await req.json();
    const { source, limit = 5 } = body;

    if (!['dezeen', 'leibal', 'all'].includes(source)) {
      return NextResponse.json({ 
        error: 'Invalid source. Must be "dezeen", "leibal", or "all"' 
      }, { status: 400 });
    }

    isScrapingInProgress = true;
    const results = { dezeen: [], leibal: [] };
    const startTime = Date.now();

    try {
      if (source === 'all' || source === 'dezeen') {
        const dezeenScraper = new DezeenScraper();
        await dezeenScraper.initialize();
        results.dezeen = await dezeenScraper.scrapeLatestArticles(limit);
        await dezeenScraper.close();
      }

      if (source === 'all' || source === 'leibal') {
        const leibalScraper = new LeibalScraper();
        await leibalScraper.initialize();
        results.leibal = await leibalScraper.scrapeLatestArticles(limit);
        await leibalScraper.close();
      }

      const duration = (Date.now() - startTime) / 1000;
      await logger.logScraping({
        source,
        articlesScraped: results.dezeen.length + results.leibal.length,
        duration,
        success: true
      });

      return NextResponse.json({
        status: 'success',
        data: results,
        totalScraped: results.dezeen.length + results.leibal.length,
        duration
      });

    } finally {
      isScrapingInProgress = false;
    }

  } catch (error) {
    await logger.logError(error, { context: 'scraping', source });
    return NextResponse.json({ 
      error: 'Failed to scrape articles',
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    isScrapingInProgress
  });
}