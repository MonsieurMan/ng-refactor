export function indentWithTwoTabs(str: string): string {
    return str.replace(/\r?\n|\r/gm, '\r\n\t\t');
}

export function unindent(str: string): string {
    return str.replace(/(\r?\n|\r)(\t\t|\t\t\t\t|        )/gm, '\r\n');
}
