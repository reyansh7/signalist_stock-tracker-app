import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Formatted string like "$3.10T", "$900.00B", "$25.00M" or "$999,999.99"
export function formatMarketCapValue(marketCapUsd: number): string {
  if (!Number.isFinite(marketCapUsd) || marketCapUsd <= 0) return "N/A";

  if (marketCapUsd >= 1e12) return `$${(marketCapUsd / 1e12).toFixed(2)}T`; // Trillions
  if (marketCapUsd >= 1e9) return `$${(marketCapUsd / 1e9).toFixed(2)}B`; // Billions
  if (marketCapUsd >= 1e6) return `$${(marketCapUsd / 1e6).toFixed(2)}M`; // Millions
  return `$${marketCapUsd.toFixed(2)}`; // Below one million, show full USD amount
}

export const getDateRange = (days: number) => {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(toDate.getDate() - days);
  return {
    to: toDate.toISOString().split('T')[0],
    from: fromDate.toISOString().split('T')[0],
  };
}

export function validateArticle(article: RawNewsArticle): boolean {
  return !!(article.headline && article.summary && article.url && article.source && article.datetime);
}

export function formatArticle(
  article: RawNewsArticle,
  isCompanyNews: boolean,
  symbol?: string,
  index?: number
): MarketNewsArticle {
  return {
    id: index || 0,
    headline: article.headline || '',
    summary: article.summary || '',
    url: article.url || '',
    source: article.source || '',
    datetime: article.datetime || 0,
    image: article.image,
    category: article.category || (isCompanyNews ? 'company' : 'general'),
    related: article.related || symbol || '',
  };
}
