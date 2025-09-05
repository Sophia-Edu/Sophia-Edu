/**
 * Masks a URL to show only the first two letters of the domain for unpaid users
 * @param url The full URL to mask
 * @returns Masked URL (e.g., "www.md.com") for unpaid users
 */
export const maskUrl = (url: string): string => {
  try {
    if (!url) return '';
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    const firstTwoLetters = domain.slice(0, 2);
    return `www.${firstTwoLetters}.com`;
  } catch {
    // If URL parsing fails, return a generic masked URL
    return 'www.**.com';
  }
};
