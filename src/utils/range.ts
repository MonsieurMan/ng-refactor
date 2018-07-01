import { Range, TextDocument } from 'vscode';

export function wholeMatch(match: RegExpExecArray, document: TextDocument): Range {
    return new Range(
        document.positionAt(match.index),
        document.positionAt(match.index + match[0].length),
    );
}
