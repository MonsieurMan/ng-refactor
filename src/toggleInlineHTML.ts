import { window, CodeActionProvider, TextDocument, Range, CodeActionContext, CancellationToken, Command } from 'vscode';
import { writeFileSync, unlinkSync, readFileSync } from 'fs';

import { Commands } from './commands';

export function toggleInlineHTML() {
    if (window.activeTextEditor) {
        const componentFile = window.activeTextEditor.document;
        const componentFilePath = componentFile.fileName;
        const componentFileContent = readFileSync(componentFilePath).toString();
        const templateUrlRegExp = /templateUrl: '.\/(.*)',/gm;
        const urlRegexpMatch = templateUrlRegExp.exec(componentFileContent);

        if (urlRegexpMatch !== null) {
            inlineTemplateFile(componentFilePath, componentFileContent);
        } else {
            extractTemplateFile(componentFileContent, componentFilePath);
        }
    }
}

function inlineTemplateFile(componentFilePath: string, componentFileContent: string) {
    const templateFilePath = componentFilePath.replace(/.ts$/, '.html');
    const templateFileContent = readFileSync(templateFilePath).toString().trim().replace(/\r?\n|\r/gm, '\r\n\t\t') // Add two tabs
    const newComponentContent = componentFileContent.replace(/templateUrl: '.\/(.*)',/gm, `template: \`\n\t\t${templateFileContent}\n\t\`,`);

    writeFileSync(componentFilePath, newComponentContent);
    unlinkSync(templateFilePath);
}

function extractTemplateFile(componentFileContent: string, componentFilePath: string) {
    const templateRegExp = /template: `([\s\S]*)`,/;
    const templateRegExpMatch = templateRegExp.exec(componentFileContent);
    const templateFileContent = templateRegExpMatch[1].replace(/(\r?\n|\r)(\t\t|\t\t\t\t|        )/gm, '\r\n').trim();
    const templateFilePath = componentFilePath.replace(/.ts$/, '.html');
    const relativeTemplateFilePath = templateFilePath.replace(/(.*)(\/|\\)/, './');
    const newComponentContent = componentFileContent.replace(templateRegExp, `templateUrl: '${relativeTemplateFilePath}',`);

    writeFileSync(templateFilePath, templateFileContent);
    writeFileSync(componentFilePath, newComponentContent);
}


export class ToggleInlineHTMLActionProvider implements CodeActionProvider {
    async provideCodeActions(document: TextDocument, range: Range, context: CodeActionContext, token: CancellationToken): Promise<Command[]> {
        if (!range.isSingleLine) {
            return;
        }
        const line = document.lineAt(range.start.line);
        if (line.text.includes('template: ') || line.text.includes('@Component({') || line.text.includes('templateUrl: ')) {
            return [{
                command: Commands.ToggleInlineHTML,
                title: 'Toggle inline html',
                tooltip: 'Toggle inline html'
            }];
        }
    }
}

