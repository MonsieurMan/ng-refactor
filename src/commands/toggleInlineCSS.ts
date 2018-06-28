import { window, TextDocument, Range, CodeActionProvider, Command } from 'vscode';

import { Commands } from '../commands';
import { isArray } from 'util';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';

const styleUrlsReg = /styleUrls: (\[.*\]),/gm;
const stylesReg = /styles: \[`([\s\S]*)`\],/gm;

export function toggleInlineCSS() {
    if (window.activeTextEditor) {
        const componentFile = window.activeTextEditor.document;
        const componentFilePath = componentFile.fileName;
        const componentFileContent = readFileSync(componentFilePath).toString();
        const urlRegexpMatch = styleUrlsReg.exec(componentFileContent);

        if (urlRegexpMatch !== null) {
            makeStyleSheetInline(urlRegexpMatch, componentFilePath, componentFileContent);
        } else {
            extractStyleSheet(componentFileContent, componentFilePath);
        }
    }
}

function extractStyleSheet(componentFileContent: string, componentFilePath: string) {
    const styleMatch = stylesReg.exec(componentFileContent);
    const styles = styleMatch[1].split('`, `');
    const styleSheetContent = styles
        .reduce((acc, cur) => acc.trim() + '\n' + cur.trim()) // Concatenante all styles
        .replace(/(\r?\n|\r)(\t\t|\t\t\t\t|        )/gm, '\r\n'); // Remove tabs at the start of each line
    const styleSheetPath = componentFilePath.replace(/.ts$/, '.scss'); // Change extension nameTODO: get from angular cli
    const relativeStyleSheetPath = styleSheetPath.replace(/(.*)(\/|\\)/, './'); // Extract filename
    const newComponentContent = componentFileContent.replace(stylesReg, `styleUrls: ['${relativeStyleSheetPath}'],`);

    writeFileSync(styleSheetPath, styleSheetContent);
    writeFileSync(componentFilePath, newComponentContent);
}

function makeStyleSheetInline(styleUrlsContent: RegExpExecArray, componentFilePath: string, componentFileContent: string) {
    const jsonParsableString = styleUrlsContent[1].replace(/'/gm, '"'); 
    const styleUrls = JSON.parse(jsonParsableString);

    if (isArray(styleUrls) && styleUrls.length === 1) {
        const styleSheetPath = styleUrls[0];
        const templateFilePath = componentFilePath.replace(/[^/\\]*component.ts$/, styleSheetPath); // TODO: get from angular config
        const templateFileContent = readFileSync(templateFilePath).toString().trim().replace(/\r?\n|\r/gm, '\r\n\t\t'); // Add two tabs
        const newComponentContent = componentFileContent.replace(styleUrlsReg, `styles: [\`\n\t\t${templateFileContent.trim()}\n\t\`],`); // Replace styleUrls by style and content

        writeFileSync(componentFilePath, newComponentContent);
        unlinkSync(templateFilePath);
    }
}

export class ToggleInlineCSSActionProvider implements CodeActionProvider {
    async provideCodeActions(document: TextDocument, range: Range): Promise<Command[]> {
        if (!range.isSingleLine) {
            return;
        }
        const line = document.lineAt(range.start.line);
        if (line.text.includes('styles: ') || line.text.includes('styleUrls: ')) {
            return [{
                command: Commands.ToggleInlineCSS,
                title: 'Toggle inline css',
                tooltip: 'Toggle inline css'
            }];
        }
    }
}