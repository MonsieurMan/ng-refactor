import { TextEditor, window } from 'vscode';

import { InlineCssToggler } from '../features/toggleInlineCSS';

export function toggleInlineCssCommand(editor?: TextEditor) {
    if (!editor) {
        window.showWarningMessage('Please open a file first.');
        return;
    }
    const toggler = new InlineCssToggler(editor.document);
    toggler.execute();
}
