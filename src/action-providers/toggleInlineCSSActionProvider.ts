import { CodeActionProvider, Command, Range, TextDocument } from 'vscode';

import { Commands } from '../commands';

export class ToggleInlineCSSActionProvider implements CodeActionProvider {
    public async provideCodeActions(document: TextDocument, range: Range): Promise<Command[]> {
        if (!range.isSingleLine) {
            return;
        }
        const line = document.lineAt(range.start.line);
        if (line.text.includes('styles: ') || line.text.includes('styleUrls: ')) {
            return [{
                command: Commands.ToggleInlineCSS,
                title: 'Toggle inline css',
                tooltip: 'Toggle inline css',
            }];
        }
    }
}