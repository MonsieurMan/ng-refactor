import { toggleInlineHTML, ToggleInlineHTMLActionProvider } from "./commands/toggleInlineHTML";

import { ExtensionContext, commands, languages } from 'vscode';
import { Commands } from "./commands";
import { toggleInlineCSS, ToggleInlineCSSActionProvider } from "./commands/toggleInlineCSS";

const COMPONENT_TYPESCRIPT = { language: 'typescript', scheme: 'file', pattern: '**/*.component.ts' };

export function activate(context: ExtensionContext) {
    console.log('NG-Refactor activated');

    const toggleInlineHTMLCommand = commands.registerCommand(Commands.ToggleInlineHTML, () => {
        toggleInlineHTML();
    });
    const toggleInlineHTMLCodeActionProvider = languages.registerCodeActionsProvider(COMPONENT_TYPESCRIPT, new ToggleInlineHTMLActionProvider());

    const toggleInlineCssCommand = commands.registerCommand(Commands.ToggleInlineCSS, () => {
        toggleInlineCSS();
    });
    const toggleInlineCssCodeActionProvider = languages.registerCodeActionsProvider(COMPONENT_TYPESCRIPT, new ToggleInlineCSSActionProvider());
    context.subscriptions.push(
        toggleInlineHTMLCommand,
        toggleInlineHTMLCodeActionProvider,
        toggleInlineCssCommand,
        toggleInlineCssCodeActionProvider
    );
}
