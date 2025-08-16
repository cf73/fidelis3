/**
 * Parse Statamic content format to extract plain text
 * Handles JSON arrays with content blocks from Statamic CMS
 */
export const parseStatamicContent = (content: string): string => {
  if (!content) return '';
  
  try {
    // Check if it's JSON format from Statamic
    if (content.startsWith('[') || content.startsWith('{')) {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        // Extract text from Statamic content blocks
        return parsed
          .map((block: any) => {
            if (block.type === 'paragraph' && block.content) {
              return block.content
                .map((item: any) => item.text || '')
                .join('');
            }
            return '';
          })
          .join('\n')
          .trim();
      }
    }
    return content;
  } catch {
    // If parsing fails, return the original content
    return content;
  }
};

/**
 * Convert a string to a URL-friendly slug
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Format price with proper currency display
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}; 