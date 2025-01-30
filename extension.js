const vscode = require('vscode');

function activate(context) {
    console.log("this is working");
    let disposable = vscode.workspace.onDidChangeTextDocument(event => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const position = editor.selection.active;

        if (position.line < 0) return;

        const line = document.lineAt(position.line).text.trim();

        // Match command format: changelog-[major|minor|patch]-[added|changed|fixed|removed|secured]
        const match = line.match(/^changelog-(major|minor|patch)-(added|changed|fixed|removed|secured)/);
        if (match) {
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

    // Increment version based on type
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

    const newVersion = `## ${latestVersion.join(".")} - ${new Date().toLocaleString()}`;
    const newEntry = `\n\n${newVersion}\n\n### ${changeType.toUpperCase()}: [Note user can add]\n\n---\n`;

    editor.edit(editBuilder => {
        editBuilder.insert(new vscode.Position(document.lineCount, 0), newEntry);
    }).then(() => {
        // Remove the typed command after inserting the new entry
        editor.edit(editBuilder => {
            const lineRange = document.lineAt(lineNumber).range;
            editBuilder.delete(lineRange);
        });
    });
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
