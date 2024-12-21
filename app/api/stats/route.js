import { NextResponse } from 'next/server';
import db from '../../../database/db';
import logger from '../../../services/logger';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'week';

    let days;
    switch (range) {
      case 'day': days = 1; break;
      case 'month': days = 30; break;
      default: days = 7;
    }

    const stats = await logger.getScrapingStats(days);
    const recentErrors = await logger.getRecentErrors(24);

    // Get additional stats from database
    const dbStats = await db.connection('articles')
      .select('source_name')
      .count('* as count')
      .where('created_at', '>', db.connection.raw(`NOW() - INTERVAL '${days} days'`))
      .groupBy('source_name');

    return NextResponse.json({
      totalArticles: stats.articlesCounts.total,
      successRate: ((stats.successfulScrapes / stats.totalScrapes) * 100).toFixed(1),
      avgProcessingTime: (stats.totalScrapes ? stats.totalDuration / stats.totalScrapes : 0).toFixed(1),
      sourceStats: dbStats,
      recentErrors: recentErrors.length,
      trends: stats.trends
    });

  } catch (error) {
    await logger.logError(error, { context: 'stats' });
    return NextResponse.json({ 
      error: 'Failed to fetch statistics',
      details: error.message 
    }, { status: 500 });
  }
}