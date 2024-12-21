const fs = require('fs').promises;
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.errorLogPath = path.join(this.logDir, 'error.log');
    this.scrapingLogPath = path.join(this.logDir, 'scraping.log');
    this.initialize();
  }

  async initialize() {
    try {
      await fs.mkdir(this.logDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create log directory:', error);
    }
  }

  async logError(error, context = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      type: 'error',
      message: error.message,
      stack: error.stack,
      context,
    };

    try {
      await fs.appendFile(
        this.errorLogPath,
        JSON.stringify(logEntry) + '\n'
      );
    } catch (err) {
      console.error('Failed to write error log:', err);
    }

    if (context.critical) {
      await this.notifyAdmins(logEntry);
    }
  }

  async logScraping(data) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      type: 'scraping',
      ...data
    };

    try {
      await fs.appendFile(
        this.scrapingLogPath,
        JSON.stringify(logEntry) + '\n'
      );
    } catch (err) {
      console.error('Failed to write scraping log:', err);
    }
  }

  async getRecentErrors(hours = 24) {
    try {
      const logs = await fs.readFile(this.errorLogPath, 'utf8');
      const entries = logs.trim().split('\n').map(line => JSON.parse(line));
      
      const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
      return entries.filter(entry => new Date(entry.timestamp) > cutoff);
    } catch (error) {
      console.error('Failed to read error logs:', error);
      return [];
    }
  }

  async getScrapingStats(days = 7) {
    try {
      const logs = await fs.readFile(this.scrapingLogPath, 'utf8');
      const entries = logs.trim().split('\n').map(line => JSON.parse(line));
      
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const recentEntries = entries.filter(entry => new Date(entry.timestamp) > cutoff);

      return {
        totalScrapes: recentEntries.length,
        successfulScrapes: recentEntries.filter(entry => !entry.error).length,
        failedScrapes: recentEntries.filter(entry => entry.error).length,
        articlesCounts: recentEntries.reduce((acc, entry) => {
          if (entry.articlesScraped) {
            acc.total += entry.articlesScraped;
          }
          return acc;
        }, { total: 0 }),
        trends: this.generateTrends(recentEntries, days)
      };
    } catch (error) {
      console.error('Failed to read scraping logs:', error);
      return null;
    }
  }

  generateTrends(entries, days) {
    const trends = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const dayStr = date.toISOString().split('T')[0];
      
      const dayEntries = entries.filter(entry => 
        entry.timestamp.startsWith(dayStr)
      );

      trends.push({
        date: dayStr,
        articles: dayEntries.reduce((sum, entry) => 
          sum + (entry.articlesScraped || 0), 0
        ),
        successRate: dayEntries.length ? 
          (dayEntries.filter(entry => !entry.error).length / dayEntries.length) * 100 : 0
      });
    }

    return trends;
  }

  async notifyAdmins(logEntry) {
    console.error('CRITICAL ERROR:', logEntry);
  }
}

module.exports = new Logger();