import { TextDocument, window, workspace, WorkspaceEdit } from 'vscode';

import { unlinkSync, writeFileSync } from 'fs';
import { isArray } from 'util';

import { tryRead } from '../utils/fs';
import { wholeMatch } from '../utils/range';
import { indentWithTwoTabs, unindent } from '../utils/string';
import { extractFileName } from '../utils/url';

export class InlineCssToggler {

    constructor(
        private document: TextDocument,
    ) { }

    public execute() {
        const componentFileContent = this.document.getText();
        const urlRegexpMatch = /styleUrls: (\[.*\])/gm.exec(componentFileContent);

        if (urlRegexpMatch !== null) {
            this.makeStyleSheetInline(urlRegexpMatch);
        } else {
            this.extractStyleSheet();
        }
    }

    private makeStyleSheetInline(styleUrlsContent: RegExpExecArray) {
        const jsonParsableString = styleUrlsContent[1].replace(/'/gm, '"');
        const styleUrls = JSON.parse(jsonParsableString);

        if (isArray(styleUrls) && styleUrls.length === 1) {
            this.copyInlineAndDelete(styleUrls);
        } else {
            window.showErrorMessage('Unsupported mutliple external template files');
        }
    }

    private copyInlineAndDelete(styleUrls: any[]) {
        const styleSheetPath = styleUrls[0];
        const templateFilePath = this.document.fileName.replace(/[^/\\]*component.ts$/, styleSheetPath);
        const templateFile = tryRead(templateFilePath);
        const templateFileContent = indentWithTwoTabs(templateFile.trim());
        const match = /styleUrls: (\[.*\])/gm.exec(this.document.getText());

        this.replaceMatchWith(match, `styles: [\`\n\t\t\t${templateFileContent.trim()}\n\t\t\`]`);
        unlinkSync(templateFilePath);
    }

    private extractStyleSheet() {
        const match = /styles: \[['|"|`]([\s\S]*)['|"|`]\]/gm.exec(this.document.getText());
        const styles = match[1].split('`, `');
        const styleSheetPath = this.document.fileName.replace(/.ts$/, '.scss');
        const relativeStyleSheetPath = './' + extractFileName(styleSheetPath);
        let styleSheetContent = styles
            .reduce((acc, cur) => acc.trim() + '\n' + cur.trim()); // Concatenante all styles;
        styleSheetContent = unindent(styleSheetContent);

        const newContent = `styleUrls: ['${relativeStyleSheetPath}']`;
        this.replaceMatchWith(match, newContent);
        writeFileSync(styleSheetPath, styleSheetContent);
    }

    private replaceMatchWith(match: RegExpExecArray, newContent: string) {
        const edit = new WorkspaceEdit();
        edit.replace(this.document.uri, wholeMatch(match, this.document), newContent);
        workspace.applyEdit(edit);
    }
}
