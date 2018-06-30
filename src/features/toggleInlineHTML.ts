import { TextDocument } from 'vscode';

import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import { extractFileName } from '../utils/url';

const templateUrlRegExp = /templateUrl: '.\/(.*)'/gm;
const templateRegExp = /template: `([\s\S]*)`/;

export class InlineHtmlToggler {
    constructor(
        private document: TextDocument,
    ) { }

    public execute() {
        const componentFilePath = this.document.fileName;
        const componentFileContent = readFileSync(componentFilePath).toString();
        const urlRegexpMatch = templateUrlRegExp.exec(componentFileContent);

        if (urlRegexpMatch !== null) {
            this.inlineTemplateFile(componentFilePath, componentFileContent);
        } else {
            this.extractTemplateFile(componentFileContent, componentFilePath);
        }
    }

    private inlineTemplateFile(componentFilePath: string, componentFileContent: string) {
        const templateFilePath = componentFilePath.replace(/.ts$/, '.html');
        const templateFileContent = readFileSync(templateFilePath)
            .toString().trim().replace(/\r?\n|\r/gm, '\r\n\t\t'); // Add two tabs
        const newComponentContent = componentFileContent
            .replace(templateUrlRegExp, `template: \`\n\t\t${templateFileContent}\n\t\``);

        writeFileSync(componentFilePath, newComponentContent);
        unlinkSync(templateFilePath);
    }

    private extractTemplateFile(componentFileContent: string, componentFilePath: string) {
        const templateRegExpMatch = templateRegExp.exec(componentFileContent);
        const templateFileContent = templateRegExpMatch[1]
            .replace(/(\r?\n|\r)(\t\t|\t\t\t\t|        )/gm, '\r\n').trim(); // remove indentation
        const templateFilePath = componentFilePath.replace(/.ts$/, '.html');
        const relativeTemplateFilePath = './' + extractFileName(templateFilePath);
        const newComponentContent = componentFileContent
            .replace(templateRegExp, `templateUrl: '${relativeTemplateFilePath}'`);

        writeFileSync(templateFilePath, templateFileContent);
        writeFileSync(componentFilePath, newComponentContent);
    }
}
