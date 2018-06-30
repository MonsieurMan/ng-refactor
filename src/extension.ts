import { commands, ExtensionContext, languages } from 'vscode';

import { COMPONENT_TYPESCRIPT } from './selectors';
import { Commands } from './commands';

import { toggleInlineHTML } from './commands/toggleInlineHTML';
import { toggleInlineCSS } from './commands/toggleInlineCSS';

import { ToggleInlineHTMLActionProvider } from './action-providers/toggleInlineHTMLActionProvider';
import { ToggleInlineCSSActionProvider } from './action-providers/toggleInlineCSSActionProvider';

export function activate(context: ExtensionContext) {
    console.log('NG-Refactor extension successfuly activated.');

    const toggleInlineHTMLCommand = commands.registerCommand(
        Commands.ToggleInlineHTML, 
        toggleInlineHTML
    );
    const toggleInlineCssCommand = commands.registerCommand(
        Commands.ToggleInlineCSS, 
        toggleInlineCSS,
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
        toggleInlineHTMLCommand,
        toggleInlineCssCommand,
        toggleInlineHTMLCodeActionProvider,
        toggleInlineCssCodeActionProvider,
    );
}
