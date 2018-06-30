import { CodeActionProvider, Command, Range, TextDocument } from 'vscode';

import { Commands } from '../commands';

export class ToggleInlineHTMLActionProvider implements CodeActionProvider {
    public async provideCodeActions(document: TextDocument, range: Range): Promise<Command[]> {
        if (!range.isSingleLine) {
            return;
        }
        const line = document.lineAt(range.start.line);
        if (line.text.includes('template: ') || line.text.includes('templateUrl: ')) {
            return [{
                command: Commands.ToggleInlineHTML,
                title: 'Toggle inline html',
                tooltip: 'Toggle inline html',
            }];
        }
    }
}