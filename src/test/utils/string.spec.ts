import { unindent } from '../../utils/string';

it('unindent correctly', () => {
    const indented = '\r\t\t';
    expect(unindent(indented)).toBe('\r\n');
});
