import { TextEditor, window } from 'vscode';

import { InlineHtmlToggler } from '../features/toggleInlineHTML';

export function toggleInlineHTMLCommand(editor?: TextEditor) {
    if (!editor) {
        window.showWarningMessage('Please open a file first.');
        return;
    }
    const toggler = new InlineHtmlToggler(editor.document);
    toggler.execute();
}
