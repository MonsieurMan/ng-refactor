import { commands, Disposable, ExtensionContext, languages, window } from 'vscode';

import { Commands } from './commands';
import { COMPONENT_TYPESCRIPT } from './selectors';

import { ToggleInlineCSSActionProvider } from './action-providers/toggleInlineCSSActionProvider';
import { ToggleInlineHTMLActionProvider } from './action-providers/toggleInlineHTMLActionProvider';

import { toggleInlineCssCommand } from './commands/toggleInlineCSSComand';
import { toggleInlineHTMLCommand } from './commands/toggleInlineHTMLCommand';

export function activate(context: ExtensionContext) {
    console.log('NG-Refactor extension successfuly activated.');

    context.subscriptions.push(
        ...registerCommands(),
        ...registerActionProviders(),
    );
}

function registerCommands(): Disposable[] {
    return [
        commands.registerCommand(
            Commands.ToggleInlineHTML, () => toggleInlineHTMLCommand(window.activeTextEditor),
        ),
        commands.registerCommand(
            Commands.ToggleInlineCSS, () => toggleInlineCssCommand(window.activeTextEditor),
        ),
    ];
}

function registerActionProviders(): Disposable[] {
    return [
        languages.registerCodeActionsProvider(
            COMPONENT_TYPESCRIPT, new ToggleInlineHTMLActionProvider(),
        ),
        languages.registerCodeActionsProvider(
            COMPONENT_TYPESCRIPT, new ToggleInlineCSSActionProvider(),
        ),
    ];
}
