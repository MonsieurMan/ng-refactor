import { commands, ExtensionContext, languages, window } from 'vscode';

import { Commands } from './commands';
import { COMPONENT_TYPESCRIPT } from './selectors';

import { ToggleInlineCSSActionProvider } from './action-providers/toggleInlineCSSActionProvider';
import { ToggleInlineHTMLActionProvider } from './action-providers/toggleInlineHTMLActionProvider';

import { toggleInlineCssCommand } from './commands/toggleInlineCSSComand';
import { toggleInlineHTMLCommand } from './commands/toggleInlineHTMLCommand';

export function activate(context: ExtensionContext) {
    console.log('NG-Refactor extension successfuly activated.');

    const toggleInlineHTMLCommandDisposable = commands.registerCommand(
        Commands.ToggleInlineHTML,
        () => toggleInlineHTMLCommand(window.activeTextEditor),
    );
    const toggleInlineCssCommandDisposable = commands.registerCommand(
        Commands.ToggleInlineCSS,
        () => toggleInlineCssCommand(window.activeTextEditor),
    );

    const toggleInlineHTMLCodeActionProvider = languages.registerCodeActionsProvider(
        COMPONENT_TYPESCRIPT,
        new ToggleInlineHTMLActionProvider(),
    );
    const toggleInlineCssCodeActionProvider = languages.registerCodeActionsProvider(
        COMPONENT_TYPESCRIPT,
        new ToggleInlineCSSActionProvider(),
    );

    context.subscriptions.push(
        toggleInlineHTMLCommandDisposable,
        toggleInlineCssCommandDisposable,
        toggleInlineHTMLCodeActionProvider,
        toggleInlineCssCodeActionProvider,
    );
}
