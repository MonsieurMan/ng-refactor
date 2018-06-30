import { TextDocument } from 'vscode';

import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import { isArray } from 'util';
import { extractFileName } from '../utils/url';

const styleUrlsReg = /styleUrls: (\[.*\])/gm;
const stylesReg = /styles: \[`([\s\S]*)`\]/gm;

export class InlineCssToggler {
    constructor(
        private document: TextDocument,
    ) { }

    public execute() {
        const componentFilePath = this.document.fileName;
        const componentFileContent = readFileSync(componentFilePath).toString();
        const urlRegexpMatch = styleUrlsReg.exec(componentFileContent);

        if (urlRegexpMatch !== null) {
            this.makeStyleSheetInline(urlRegexpMatch, componentFilePath, componentFileContent);
        } else {
            this.extractStyleSheet(componentFileContent, componentFilePath);
        }
    }

    private extractStyleSheet(componentFileContent: string, componentFilePath: string) {
        const styleMatch = stylesReg.exec(componentFileContent);
        const styles = styleMatch[1].split('`, `');
        const styleSheetContent = styles
            .reduce((acc, cur) => acc.trim() + '\n' + cur.trim()) // Concatenante all styles
            .replace(/(\r?\n|\r)(\t\t|\t\t\t\t|        )/gm, '\r\n'); // Remove tabs at the start of each line
        const styleSheetPath = componentFilePath.replace(/.ts$/, '.scss');
        // Change extension name TODO: get from angular cli
        const relativeStyleSheetPath = './' + extractFileName(styleSheetPath);
        const newComponentContent = componentFileContent.replace(stylesReg, `styleUrls: ['${relativeStyleSheetPath}']`);

        writeFileSync(styleSheetPath, styleSheetContent);
        writeFileSync(componentFilePath, newComponentContent);
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
            // TODO: get from angular config
            const templateFileContent = readFileSync(templateFilePath)
                .toString().trim().replace(/\r?\n|\r/gm, '\r\n\t\t');
            // Add two tabs
            const newComponentContent = componentFileContent
                .replace(styleUrlsReg, `styles: [\`\n\t\t${templateFileContent.trim()}\n\t\`]`);
            // Replace styleUrls by style and content

            writeFileSync(componentFilePath, newComponentContent);
            unlinkSync(templateFilePath);
        }
    }
}
