export function indentWithTwoTabs(str: string): string {
    return str.replace(/\r?\n|\r/gm, '\r\n\t\t');
}
