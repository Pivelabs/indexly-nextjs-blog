import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

export function truncateText(text: string, length: number = 150): string {
  if (text.length <= length) return text;
  
  const truncated = text.substring(0, length);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace === -1) return truncated + '...';
  
  return truncated.substring(0, lastSpace) + '...';
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

export function getReadingTime(content: string, wordsPerMinute: number = 200): number {
  const text = stripHtml(content);
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}
