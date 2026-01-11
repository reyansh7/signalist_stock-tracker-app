'use server';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

interface FetchJSONOptions {
  revalidateSeconds?: number;
}

interface NewsArticle {
  id?: number;
  category?: string;
  datetime: number;
  headline: string;
  image?: string;
  related?: string;
  source: string;
  summary: string;
  url: string;
}

interface FormattedArticle {
  id: string;
  headline: string;
  summary: string;
  url: string;
  source: string;
  datetime: number;
  image?: string;
  symbol?: string;
}

async function fetchJSON<T>(url: string, options?: FetchJSONOptions): Promise<T> {
  const fetchOptions: RequestInit = options?.revalidateSeconds
    ? {
        cache: 'force-cache',
        next: { revalidate: options.revalidateSeconds },
      }
    : { cache: 'no-store' };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

function isValidArticle(article: NewsArticle): boolean {
  return !!(
    article &&
    article.headline &&
    article.summary &&
    article.url &&
    article.source &&
    article.datetime
  );
}

function formatArticle(article: NewsArticle, symbol?: string): FormattedArticle {
  return {
    id: article.id?.toString() || article.url,
    headline: article.headline,
    summary: article.summary,
    url: article.url,
    source: article.source,
    datetime: article.datetime,
    image: article.image,
    symbol,
  };
}

export async function getNews(symbols?: string[]): Promise<FormattedArticle[]> {
  try {
    if (!FINNHUB_API_KEY) {
      throw new Error('Finnhub API key not configured');
    }

    // Compute date range for last 5 days
    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setDate(dateTo.getDate() - 5);

    const toDateStr = dateTo.toISOString().split('T')[0];
    const fromDateStr = dateFrom.toISOString().split('T')[0];

    // If symbols exist, fetch company news
    if (symbols && symbols.length > 0) {
      // Clean and uppercase symbols
      const cleanedSymbols = symbols
        .map(s => s.trim().toUpperCase())
        .filter(s => s.length > 0)
        .slice(0, 6); // Limit to 6 symbols max

      const articles: FormattedArticle[] = [];
      const maxRounds = 6;

      // Round-robin through symbols
      for (let round = 0; round < maxRounds; round++) {
        for (const symbol of cleanedSymbols) {
          if (articles.length >= 6) break;

          try {
            const url = `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=${fromDateStr}&to=${toDateStr}&token=${FINNHUB_API_KEY}`;
            const news = await fetchJSON<NewsArticle[]>(url);

            // Take one valid article per round
            if (news && news.length > round) {
              const article = news[round];
              if (isValidArticle(article)) {
                articles.push(formatArticle(article, symbol));
              }
            }
          } catch (error) {
            console.error(`Error fetching news for symbol ${symbol}:`, error);
            // Continue with other symbols
          }
        }
        if (articles.length >= 6) break;
      }

      // Sort by datetime descending and return
      return articles
        .sort((a, b) => b.datetime - a.datetime)
        .slice(0, 6);
    }

    // If no symbols, fetch general market news
    const url = `${FINNHUB_BASE_URL}/news?category=general&token=${FINNHUB_API_KEY}`;
    const news = await fetchJSON<NewsArticle[]>(url);

    if (!news || news.length === 0) {
      return [];
    }

    // Deduplicate by id/url/headline
    const seen = new Set<string>();
    const uniqueArticles: FormattedArticle[] = [];

    for (const article of news) {
      if (!isValidArticle(article)) continue;

      const key = article.id?.toString() || article.url || article.headline;
      if (seen.has(key)) continue;

      seen.add(key);
      uniqueArticles.push(formatArticle(article));

      if (uniqueArticles.length >= 6) break;
    }

    return uniqueArticles.sort((a, b) => b.datetime - a.datetime);
  } catch (error) {
    console.error('Error in getNews:', error);
    throw new Error('Failed to fetch news');
  }
}
