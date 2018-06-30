import { extractFileName } from '../../src/utils/url';

describe('Extract file name', () => {
    it('Extract from regular file path', () => {
        const url = '/home/test/test.component.ts';
        const result = extractFileName(url);

        expect(result).toBe('test.component.ts');
    });

    it('Exctract from windows file path', () => {
        const url = 'c\\test\\test.component.ts';
        const result = extractFileName(url);

        expect(result).toBe('test.component.ts');
    });
});
