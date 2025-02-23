const assert = require('assert');
const vscode = require('vscode');
const extension = require('../extension');

// --- Fake VS Code Classes --- //
class FakeTextDocument {
    constructor(text) {
        this.text = text;
        this.lines = text.split("\n");
    }
    getText() {
        return this.text;
    }
    lineAt(line) {
        if (line < 0 || line >= this.lines.length) {
            throw new Error("Line out of bounds");
        }
        const lineText = this.lines[line];
        return {
            text: lineText,
            range: { start: { line, character: 0 }, end: { line, character: lineText.length } }
        };
    }
}

class FakeEditBuilder {
    constructor() {
        this.operations = [];
    }
    insert(position, text) {
        this.operations.push({ op: 'insert', position, text });
    }
    delete(range) {
        this.operations.push({ op: 'delete', range });
    }
}

class FakeTextEditor {
    constructor(document) {
        this.document = document;
        this.editCalls = []; // Array to capture each call to edit (each with its operations)
        // For activate tests
        this.selection = { active: { line: 0 } };
    }
    edit(callback) {
        const builder = new FakeEditBuilder();
        callback(builder);
        this.editCalls.push(builder.operations);
        return Promise.resolve(true);
    }
}

// Override vscode.Position with a fake so that new vscode.Position(line, 0) works as expected.
class FakePosition {
    constructor(line, character) {
        this.line = line;
        this.character = character;
    }
}
// @ts-ignore
vscode.Position = FakePosition;

// --- Tests --- //
describe('Extension Tests', function() {

    describe('activate', function() {
        let originalOnDidChangeTextDocument;
        let capturedCallback; // Will store the callback registered by activate
        const fakeDisposable = { dispose: () => {} };

        before(function() {
            // Override onDidChangeTextDocument to capture the event callback.
            originalOnDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument;
            // @ts-ignore
            vscode.workspace.onDidChangeTextDocument = function(callback) {
                capturedCallback = callback;
                return fakeDisposable;
            }
        });

        after(function() {
            // @ts-ignore
            vscode.workspace.onDidChangeTextDocument = originalOnDidChangeTextDocument;
        });

        it('should not run updateChangelog if there is no active text editor', function() {
            // Arrange: Set activeTextEditor to null.
            const originalActiveTextEditor = vscode.window.activeTextEditor;
            vscode.window.activeTextEditor = null;

            let updateCalled = false;
            const originalUpdate = extension.updateChangelog;
            extension.updateChangelog = function() {
                updateCalled = true;
            };

            const fakeContext = { subscriptions: [] };
            extension.activate(fakeContext);
            // Simulate a text document change event with a valid matching text.
            capturedCallback({
                contentChanges: [{ text: 'cl-ma-added-Feature--' }],
                document: new FakeTextDocument("cl-ma-added-Feature--")
            });
            assert.strictEqual(updateCalled, false, 'updateChangelog should not be called when there is no active editor');

            // Restore activeTextEditor and updateChangelog
            vscode.window.activeTextEditor = originalActiveTextEditor;
            extension.updateChangelog = originalUpdate;
        });

        it('should not run updateChangelog if there are no contentChanges', function() {
            // Arrange: Set an active editor.
            const fakeDoc = new FakeTextDocument("cl-ma-added-Feature--");
            const fakeEditor = new FakeTextEditor(fakeDoc);
            // @ts-ignore
            vscode.window.activeTextEditor = fakeEditor;

            let updateCalled = false;
            const originalUpdate = extension.updateChangelog;
            extension.updateChangelog = function() {
                updateCalled = true;
            };

            const fakeContext = { subscriptions: [] };
            extension.activate(fakeContext);
            // Simulate an event with empty contentChanges.
            capturedCallback({
                contentChanges: [],
                document: fakeDoc
            });
            assert.strictEqual(updateCalled, false, 'updateChangelog should not be called if contentChanges is empty');

            extension.updateChangelog = originalUpdate;
        });

        it('should not run updateChangelog if the text does not match the expected pattern', function() {
            // Arrange: Active editor with text that does not match the regex.
            const fakeDoc = new FakeTextDocument("some other text");
            const fakeEditor = new FakeTextEditor(fakeDoc);
            // @ts-ignore
            vscode.window.activeTextEditor = fakeEditor;

            let updateCalled = false;
            const originalUpdate = extension.updateChangelog;
            extension.updateChangelog = function() {
                updateCalled = true;
            };

            const fakeContext = { subscriptions: [] };
            extension.activate(fakeContext);
            capturedCallback({
                contentChanges: [{ text: "some other text" }],
                document: fakeDoc
            });
            assert.strictEqual(updateCalled, false, 'updateChangelog should not be called when text does not match pattern');

            extension.updateChangelog = originalUpdate;
        });

        it('should call updateChangelog on a valid matching change', function() {
            // Arrange: Active editor with a text that matches the regex.
            const matchingLine = "cl-ma-added-NewFeature--";
            const fakeDoc = new FakeTextDocument(matchingLine);
            const fakeEditor = new FakeTextEditor(fakeDoc);
            // @ts-ignore
            vscode.window.activeTextEditor = fakeEditor;

            let updateCalled = false;
            const originalUpdate = extension.updateChangelog;
            let updateParams = {};
            extension.updateChangelog = function(editor, document, verType, changeType, description, line) {
                updateCalled = true;
                updateParams = { editor, document, verType, changeType, description, line };
            };

            const fakeContext = { subscriptions: [] };
            extension.activate(fakeContext);
            // Set the editor’s selection so that the active line is the one with the matching text.
            fakeEditor.selection = { active: { line: 0 } };

            capturedCallback({
                contentChanges: [{ text: matchingLine }],
                document: fakeDoc
            });
            assert.strictEqual(updateCalled, true, 'updateChangelog should be called when a valid matching change is made');
            assert.strictEqual(updateParams.verType, 'ma');
            assert.strictEqual(updateParams.changeType, 'added');
            assert.strictEqual(updateParams.description, 'NewFeature');
            assert.strictEqual(updateParams.line, 0);
            extension.updateChangelog = originalUpdate;
        });
    });

    describe('updateChangelog', function() {
        it('should insert a changelog header and entry when no existing changelog is present', async function() {
            // Arrange: Document without an existing "# Changelog" header.
            const initialText = "Some initial content\nLine 2";
            const fakeDoc = new FakeTextDocument(initialText);
            const fakeEditor = new FakeTextEditor(fakeDoc);

            // Act: Call updateChangelog for a major update.
            await extension.updateChangelog(fakeEditor, fakeDoc, "ma", "added", "Test change", 1);

            // Assert: Expect two calls to edit (one for insertion and one for deletion)
            assert.strictEqual(fakeEditor.editCalls.length, 2, 'Should call edit twice (insert then delete)');
            const firstOps = fakeEditor.editCalls[0];
            // One of the operations should insert the "# Changelog" header.
            const headerOp = firstOps.find(op => op.op === 'insert' && op.position.line === 0);
            assert(headerOp, 'First edit should insert the changelog header');
            assert(headerOp.text.includes("# Changelog"), 'Inserted text should include the changelog header');

            // The second edit call should contain a deletion operation.
            const secondOps = fakeEditor.editCalls[1];
            assert(secondOps.some(op => op.op === 'delete'), 'Second edit should contain a delete operation');
        });

        it('should update the version correctly for a major update', async function() {
            // Arrange: Document with an existing changelog table header and a version at line 6.
            const changelogContent = [
                "# Changelog",
                "Intro line",
                "Another line",
                "More content",
                "Extra info",
                "| #     | Date                           | Type  | Change     |                                    |",
                "|-------|--------------------------------|-------|------------|------------------------------------|",
                "| 0.0.0 | 21‑01‑01 <br>00:00             | DUMMY | DUMMY      | Dummy entry                        |"
            ].join("\n");
            const fakeDoc = new FakeTextDocument(changelogContent);
            const fakeEditor = new FakeTextEditor(fakeDoc);

            // Act: Trigger updateChangelog for a major update.
            await extension.updateChangelog(fakeEditor, fakeDoc, "ma", "fixed", "Major fix", 2);

            // Assert: The inserted text (in the first edit call) should include the new version "1.0.0"
            const firstOps = fakeEditor.editCalls[0];
            const insertOp = firstOps.find(op => op.op === 'insert');
            assert(insertOp && insertOp.text.includes("1.0.0"), 'Inserted text should contain updated major version "1.0.0"');
        });

        it('should update the version correctly for a minor update', async function() {
            // Arrange: Document with an existing changelog version.
            const changelogContent = [
                "# Changelog",
                "Intro",
                "Line",
                "Content",
                "Extra",
                "| #     | Date                           | Type  | Change     |                                    |",
                "|-------|--------------------------------|-------|------------|------------------------------------|",
                "| 1.2.3 | 21‑01‑01 <br>00:00             | DUMMY | DUMMY      | Dummy entry                        |"
            ].join("\n");
            const fakeDoc = new FakeTextDocument(changelogContent);
            const fakeEditor = new FakeTextEditor(fakeDoc);

            // Act: For a minor update, expect version to change to 1.3.0.
            await extension.updateChangelog(fakeEditor, fakeDoc, "mi", "changed", "Minor change", 3);

            // Assert: The inserted text should include "1.3.0"
            const firstOps = fakeEditor.editCalls[0];
            const insertOp = firstOps.find(op => op.op === 'insert');
            assert(insertOp && insertOp.text.includes("1.3.0"), 'Inserted text should contain updated minor version "1.3.0"');
        });

        it('should update the version correctly for a patch update', async function() {
            // Arrange: Document with an existing changelog version.
            const changelogContent = [
                "# Changelog",
                "Intro",
                "Info",
                "More info",
                "Additional",
                "| #     | Date                           | Type  | Change     |                                    |",
                "|-------|--------------------------------|-------|------------|------------------------------------|",
                "| 2.5.9 | 21‑01‑01 <br>00:00             | DUMMY | DUMMY      | Dummy entry                        |"
            ].join("\n");
            const fakeDoc = new FakeTextDocument(changelogContent);
            const fakeEditor = new FakeTextEditor(fakeDoc);

            // Act: For a patch update, expect version to change to 2.5.10.
            await extension.updateChangelog(fakeEditor, fakeDoc, "pa", "removed", "Patch removal", 4);

            // Assert: The inserted text should include "2.5.10"
            const firstOps = fakeEditor.editCalls[0];
            const insertOp = firstOps.find(op => op.op === 'insert');
            assert(insertOp && insertOp.text.includes("2.5.10"), 'Inserted text should contain updated patch version "2.5.10"');
        });

        it('should delete the correct line based on the given line number', async function() {
            // Arrange: Create a document with several lines.
            const initialText = "Line0\nLine1\nLine2\nLine3\nLine4\nLine5";
            const fakeDoc = new FakeTextDocument(initialText);
            const fakeEditor = new FakeTextEditor(fakeDoc);

            // Act: Use a line number parameter of 3.
            await extension.updateChangelog(fakeEditor, fakeDoc, "mi", "changed", "Test deletion", 3);

            // Assert: The second edit call should include a deletion operation targeting the correct line.
            const secondOps = fakeEditor.editCalls[1];
            const deleteOp = secondOps.find(op => op.op === 'delete');
            assert(deleteOp, 'There should be a delete operation');
            // According to the logic, if o is 3 then it deletes lineAt(3).range.
            assert.strictEqual(deleteOp.range.start.line, 3, 'Delete operation should target the correct line based on input');
        });
    });

    describe('deactivate', function() {
        it('should be a function', function() {
            assert.strictEqual(typeof extension.deactivate, 'function', 'deactivate should be a function');
        });
    });
});
