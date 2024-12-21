import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ScraperControl() {
  const [status, setStatus] = useState('idle');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSource, setSelectedSource] = useState('all');
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    let intervalId;
    if (status === 'scraping') {
      intervalId = setInterval(checkStatus, 5000);
    }
    return () => clearInterval(intervalId);
  }, [status]);

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/scrape');
      const data = await response.json();
      if (!data.isScrapingInProgress) {
        setStatus('idle');
      }
    } catch (err) {
      console.error('Error checking status:', err);
    }
  };

  const startScraping = async () => {
    try {
      setStatus('scraping');
      setError(null);
      setResults(null);

      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: selectedSource, limit })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Scraping failed');
      }

      setResults(data);
      setStatus('completed');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Content Scraper</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Source</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={status === 'scraping'}
            >
              <option value="all">All Sources</option>
              <option value="dezeen">Dezeen</option>
              <option value="leibal">Leibal</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Article Limit</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              min="1"
              max="20"
              className="w-full p-2 border rounded"
              disabled={status === 'scraping'}
            />
          </div>

          <button
            onClick={startScraping}
            disabled={status === 'scraping'}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'scraping' ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" />
                Scraping in progress...
              </span>
            ) : (
              'Start Scraping'
            )}
          </button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {results && (
          <Alert className="bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Scraping Complete</AlertTitle>
            <AlertDescription>
              Successfully scraped {results.totalScraped} articles:
              <ul className="mt-2 list-disc list-inside">
                {results.data.dezeen && (
                  <li>{results.data.dezeen.length} articles from Dezeen</li>
                )}
                {results.data.leibal && (
                  <li>{results.data.leibal.length} articles from Leibal</li>
                )}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}