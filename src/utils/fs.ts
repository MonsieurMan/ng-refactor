import { readFileSync } from 'fs';
import { window } from 'vscode';

export function tryRead(filePath: string): string {
    try {
        return readFileSync(filePath).toString();
    } catch (error) {
        console.error(error);
        window.showErrorMessage('Could not open file ' + filePath + ' ' + error);
        throw error;
    }
}
