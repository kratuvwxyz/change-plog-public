const assert = require('assert');
const vscode = require('vscode');
const myExtension = require('../extension');

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Check if extension is activated', async () => {
        const isActive = vscode.extensions.getExtension('desaigner.change-plog').isActive;
        assert.strictEqual(isActive, true);
    });

    test('Trigger command and check execution', async () => {
        await vscode.commands.executeCommand('extension.changelogHelper');
        assert.ok(true, 'Command executed successfully');
    });

    test('Ensure changelog entry is formatted correctly', () => {
        const mockEditor = {
            edit: (callback) => {
                let text = '';
                callback({ insert: (_, newText) => text = newText });
                assert.match(text, /### \d+\.\d+\.\d+ - .+\n\n#### (ADDED|CHANGED|DEPRECATED|FIXED|REMOVED|SECURED): /);
            }
        };
        myExtension.updateChangelog(mockEditor, null, 'minor', 'fixed', 0);
    });
});