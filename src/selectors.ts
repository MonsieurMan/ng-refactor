import { DocumentSelector } from 'vscode';

export const COMPONENT_TYPESCRIPT: DocumentSelector = {
    language: 'typescript', scheme: 'file', pattern: '**/*.component.ts',
};
export const COMPONENT_HTML: DocumentSelector = {
    language: 'html', scheme: 'file', pattern: '**/*.component.html',
};
