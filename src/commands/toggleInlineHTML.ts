import { window } from 'vscode';

import { readFileSync, unlinkSync, writeFileSync } from 'fs';

const templateUrlRegExp = /templateUrl: '.\/(.*)'/gm;
const templateRegExp = /template: `([\s\S]*)`/;

export function toggleInlineHTML() {
    if (window.activeTextEditor) {
        const componentFile = window.activeTextEditor.document;
        const componentFilePath = componentFile.fileName;
        const componentFileContent = readFileSync(componentFilePath).toString();
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
    const templateFileContent = readFileSync(templateFilePath)
        .toString().trim().replace(/\r?\n|\r/gm, '\r\n\t\t'); // Add two tabs
    const newComponentContent = componentFileContent
        .replace(templateUrlRegExp, `template: \`\n\t\t${templateFileContent}\n\t\``);

    writeFileSync(componentFilePath, newComponentContent);
    unlinkSync(templateFilePath);
}

function extractTemplateFile(componentFileContent: string, componentFilePath: string) {
    const templateRegExpMatch = templateRegExp.exec(componentFileContent);
    const templateFileContent = templateRegExpMatch[1].replace(/(\r?\n|\r)(\t\t|\t\t\t\t|        )/gm, '\r\n').trim(); // remove indentation
    const templateFilePath = componentFilePath.replace(/.ts$/, '.html');
    const relativeTemplateFilePath = templateFilePath.replace(/(.*)(\/|\\)/, './');
    const newComponentContent = componentFileContent
        .replace(templateRegExp, `templateUrl: '${relativeTemplateFilePath}'`);

    writeFileSync(templateFilePath, templateFileContent);
    writeFileSync(componentFilePath, newComponentContent);
}
