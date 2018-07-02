import { TextDocument, workspace, WorkspaceEdit } from 'vscode';

import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import { wholeMatch } from '../utils/range';
import { indentWithTwoTabs, unindent } from '../utils/string';
import { extractFileName } from '../utils/url';

export class InlineHtmlToggler {
    constructor(
        private document: TextDocument,
    ) { }

    public execute() {
        const match = /templateUrl: '.\/(.*)'/gm.exec(this.document.getText());

        if (match !== null) {
            this.inlineTemplateFile();
        } else {
            this.extractTemplateFile();
        }
    }

    private inlineTemplateFile() {
        const templateFilePath = this.document.fileName.replace(/.ts$/, '.html');
        const templateFileContent = indentWithTwoTabs(
            readFileSync(templateFilePath).toString().trim(),
        );
        const match = /templateUrl: '.\/(.*)'/gm.exec(this.document.getText());

        this.replaceMatchWith(match, `template: \`\n\t\t\t${templateFileContent}\n\t\t\``);
        unlinkSync(templateFilePath);
    }

    private extractTemplateFile() {
        const match = /template: `([\s\S]*?)`/.exec(this.document.getText());
        const templateFileContent = unindent(match[1]).trim(); // remove indentation
        const templateFilePath = this.document.fileName.replace(/.ts$/, '.html');
        const relativeTemplateFilePath = './' + extractFileName(templateFilePath);

        writeFileSync(templateFilePath, templateFileContent);
        this.replaceMatchWith(match, `templateUrl: '${relativeTemplateFilePath}'`);
    }

    private replaceMatchWith(match: RegExpExecArray, newContent: string) {
        const edit = new WorkspaceEdit();
        edit.replace(this.document.uri, wholeMatch(match, this.document), newContent);
        workspace.applyEdit(edit);
    }
}
