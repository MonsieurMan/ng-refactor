import { toggleInlineHTML, ToggleInlineHTMLActionProvider } from "./toggleInlineHTML";

import { ExtensionContext, commands, languages } from 'vscode';
import { Commands } from "./commands";

const COMPONENT_TYPESCRIPT = { language: 'typescript', scheme: 'file', pattern: '**/*.component.ts' };

export function activate(context: ExtensionContext) {
    console.log('NG-Refactor activated');

    const toggleInlineHTMLCommand = commands.registerCommand(Commands.ToggleInlineHTML, () => {
        toggleInlineHTML();
    });
    const toggleInlineHTMLCodeActionProvider = languages.registerCodeActionsProvider(COMPONENT_TYPESCRIPT, new ToggleInlineHTMLActionProvider());

    context.subscriptions.push(
        toggleInlineHTMLCommand,
        toggleInlineHTMLCodeActionProvider
    );

}
