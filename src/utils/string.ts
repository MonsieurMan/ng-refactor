// TODO: find package for string manipulation and formating

export function indentWithTwoTabs(str: string): string {
    return str.replace(/\r?\n|\r/gm, '\r\n      ');
}

export function unindent(str: string): string {
    return str.replace(/(\r?\n|\r)(\t\t|\t\t\t|\t\t\t\t|      )/gm, '\r\n');
}
