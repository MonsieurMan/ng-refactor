/**
 * Extract the file name from a full url
 * @param url Url to extract the filename from
 * @example
 * extractFileName('/home/test.txt') => 'test.txt'
 */
export function extractFileName(url: string): string {
    return url.replace(/(.*)(\/|\\)/, '');
}
