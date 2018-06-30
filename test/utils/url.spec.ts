import { extractFileName } from '../../src/utils/url';

describe('Extract file name', () => {
    it('Extract from regular file path', () => {
        const url = '/home/mrman/Desktop/Projects/diplomacy/src/app/app.component.scss';
        const result = extractFileName(url);

        expect(result).toBe('app.component.scss');
    });

    it('Exctract from windows file path', () => {
        const url = 'c\\test\\test.component.ts';
        const result = extractFileName(url);

        expect(result).toBe('test.component.ts');
    });
});
