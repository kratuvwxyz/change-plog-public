const vscode = require('vscode');

function activate(context) {
    let disposable = vscode.workspace.onDidChangeTextDocument(event => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const text = document.getText(new vscode.Range(0, 0, document.lineCount, 0)); // Get full document text

        // Check if the last typed word matches our keyword
        if (event.contentChanges.length > 0) {
            const changeText = event.contentChanges[0].text;
            if (changeText.includes("changelog-version-patch-added")) {
                updateChangelog(editor, document);
            }
        }
    });

    context.subscriptions.push(disposable);
}

function updateChangelog(editor, document) {
    const text = document.getText();
    const versionRegex = /## \[(\d+)\.(\d+)\.(\d+)]/g;
    let match;
    let latestVersion = [0, 0, 0];

    while ((match = versionRegex.exec(text)) !== null) {
        latestVersion = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }

    latestVersion[2]++; // Increment patch version
    const newVersion = `## [${latestVersion.join(".")}] - ${new Date().toISOString().split("T")[0]}`;
    const newEntry = `\n\n${newVersion}\n\n### Added\n- `;

    editor.edit(editBuilder => {
        editBuilder.insert(new vscode.Position(document.lineCount, 0), newEntry);
    });
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
