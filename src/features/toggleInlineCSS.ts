import { Range, TextDocument, window, workspace, WorkspaceEdit } from 'vscode';

import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import { isArray } from 'util';
import { extractFileName } from '../utils/url';

export class InlineCssToggler {

    constructor(
        private document: TextDocument,
    ) { }

    public execute() {
        const componentFilePath = this.document.fileName;
        const componentFileContent = this.document.getText();
        const urlRegexpMatch = /styleUrls: (\[.*\])/gm.exec(componentFileContent);

        if (urlRegexpMatch !== null) {
            this.makeStyleSheetInline(urlRegexpMatch, componentFilePath, componentFileContent);
        } else {
            this.extractStyleSheet(componentFileContent, componentFilePath);
        }
    }

    private extractStyleSheet(componentFileContent: string, componentFilePath: string) {
        const styleMatch = /styles: \[['|"|`]([\s\S]*)['|"|`]\]/gm.exec(componentFileContent);
        const styles = styleMatch[1].split('`, `');
        const styleSheetContent = styles
            .reduce((acc, cur) => acc.trim() + '\n' + cur.trim()) // Concatenante all styles
            .replace(/(\r?\n|\r)(\t\t|\t\t\t\t|        )/gm, '\r\n'); // Remove tabs at the start of each line
        const styleSheetPath = componentFilePath.replace(/.ts$/, '.scss');
        // Change extension name TODO: get from angular cli
        const relativeStyleSheetPath = './' + extractFileName(styleSheetPath);
        const match = /styles: \[['|"|`]([\s\S]*)['|"|`]\]/gm.exec(componentFileContent);

        const edit = new WorkspaceEdit();
        edit.replace(this.document.uri,
            new Range(
                this.document.positionAt(match.index),
                this.document.positionAt(match.index + match[0].length),
            ),
            `styleUrls: ['${relativeStyleSheetPath}']`,
        );
        workspace.applyEdit(edit);
        writeFileSync(styleSheetPath, styleSheetContent);
    }

    private makeStyleSheetInline(
        styleUrlsContent: RegExpExecArray,
        componentFilePath: string,
        componentFileContent: string,
    ) {
        const jsonParsableString = styleUrlsContent[1].replace(/'/gm, '"');
        const styleUrls = JSON.parse(jsonParsableString);

        if (isArray(styleUrls) && styleUrls.length === 1) {
            const styleSheetPath = styleUrls[0];
            const templateFilePath = componentFilePath.replace(/[^/\\]*component.ts$/, styleSheetPath);

            // TODO: this is outrageously ugly
            let templateFile;
            try {
                templateFile = readFileSync(templateFilePath);
            } catch (error) {
                console.error(error);
                window.showErrorMessage('Could not open file ' + styleSheetPath + ' ' + error);
            }
            const templateFileContent = templateFile
                .toString().trim().replace(/\r?\n|\r/gm, '\r\n\t\t');
            // Add two tabs

            const match = /styleUrls: (\[.*\])/gm.exec(componentFileContent);
            const edit = new WorkspaceEdit();
            edit.replace(this.document.uri,
                new Range(
                    this.document.positionAt(match.index),
                    this.document.positionAt(match.index + match[0].length),
                ),
                `styles: [\`\n\t\t${templateFileContent.trim()}\n\t\`]`,
            );
            workspace.applyEdit(edit);

            unlinkSync(templateFilePath);
        }
    }
}
