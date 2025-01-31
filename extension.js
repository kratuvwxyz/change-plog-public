const vscode = require('vscode');

let hasRun = false; // Prevents multiple runs

function activate(context) {
    let disposable = vscode.workspace.onDidChangeTextDocument((event) => {
        if (hasRun) return; // Prevents running again

        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        if (!event.contentChanges || event.contentChanges.length === 0) return;

        const document = event.document;
        const position = editor.selection.active;

        if (position.line < 0) return;

        const line = document.lineAt(position.line).text.trim();
        
        let match = line.match(/^changelog-(major|minor|patch)-(added|changed|deprecated|fixed|removed|secured)/);
        if (match) {
            hasRun = true; // Set flag to prevent multiple runs
            updateChangelog(editor, document, match[1], match[2], position.line);
        }
    });

    context.subscriptions.push(disposable);
}

function updateChangelog(editor, document, versionType, changeType, lineNumber) {
    const text = document.getText();
    const versionRegex = /## (\d+)\.(\d+)\.(\d+)/g;
    let match;
    let latestVersion = [0, 0, 0];

    while ((match = versionRegex.exec(text)) !== null) {
        latestVersion = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }

    if (versionType === "major") {
        latestVersion[0]++;
        latestVersion[1] = 0;
        latestVersion[2] = 0;
    } else if (versionType === "minor") {
        latestVersion[1]++;
        latestVersion[2] = 0;
    } else {
        latestVersion[2]++;
    }

    const newVersion = `### ${latestVersion.join(".")} - ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`;
    const newEntry = `\n---\n\n${newVersion}\n\n#### ${changeType.toUpperCase()}: `;

    editor.edit(editBuilder => {
        editBuilder.insert(new vscode.Position(document.lineCount, 0), newEntry);
    }).then(() => {
        setTimeout(() => {
            editor.edit(editBuilder => {
                const lineRange = document.lineAt(lineNumber).range;
                editBuilder.delete(lineRange);
            });
            hasRun = false; // Reset flag after execution
        }, 100);
    });
}

function deactivate() {}

module.exports = {
    activate,
    updateChangelog,
    deactivate
};
