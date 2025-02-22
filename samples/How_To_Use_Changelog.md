# How to Use the Changelog Feature

This VS Code extension automatically updates your project's changelog by listening for specially formatted commands in your source files. When you enter a command following the correct pattern, the extension will update a markdown table with a new entry that includes an incremented version number, a timestamp, and a description of your change.

## Command Format

To trigger a changelog update, type a command on its own line in your editor. The command must match the following pattern:

```
cl-<version-type>-<change-type>-<description>--
```

### Details:
- **version-type:** Determines how the version number is incremented.
  - `ma` — **Major Update:** Increments the major version and resets the minor and patch numbers (e.g., from `1.2.3` to `2.0.0`).
  - `mi` — **Minor Update:** Increments the minor version and resets the patch number (e.g., from `1.2.3` to `1.3.0`).
  - `pa` — **Patch Update:** Increments only the patch number (e.g., from `1.2.3` to `1.2.4`).

- **change-type:** Describes the nature of the change.
  - Accepted values: `added`, `changed`, `deprecated`, `fixed`, `removed`, `secured`.
  - The extension formats this value in the changelog table (for example, `ADDED` appears as `ADDED     ` with extra padding).

- **description:** A brief summary of what changed.

### Examples:
- **Adding a new security layer on login as a minor update:**
  ```
  cl-mi-secured-Added new security layor on login.--
  ```

  <video controls width="600" src="../resources/SMM01.mp4"></video>

- **Fixing a bug with a patch update:**
  ```
  cl-pa-fixed-Login issue and server error on Safari browser.--
  ```

  <video controls width="600" src="../resources/SMM02.mp4"></video>

## How It Works

1. **Detection:**  
   The extension monitors your document for text changes. When a line matches the changelog command pattern, the extension triggers the update process.

2. **Parsing the Command:**  
   The command is split into:
   - **Version Type:** (`ma`, `mi`, or `pa`) to determine whether to increment the major, minor, or patch number.
   - **Change Type:** (e.g., `added`, `fixed`) which is formatted for display.
   - **Description:** A custom message describing the change.

3. **Updating the Changelog:**
   - **Version Number:**  
     The extension retrieves the current version from the changelog (if it exists) and increments it according to the version type:
     - **Major (`ma`):** Increments the major version and resets the minor and patch numbers.
     - **Minor (`mi`):** Increments the minor version and resets the patch number.
     - **Patch (`pa`):** Increments only the patch number.
   - **Timestamp:**  
     The current date and time are formatted (using a non-breaking hyphen for consistency) as `YY‑MM‑DD <br> HH:MM`.
   - **Table Entry:**  
     A new row is constructed in the markdown table with the following columns:
     - Version number
     - Date and time
     - Version type (displayed as MAJOR, MINOR, or PATCH)
     - Change type (e.g., ADDED, FIXED)
     - Description of the change

4. **Inserting or Creating the Changelog Table:**
   - If a `# Changelog` header or table already exists in your document, the new entry is inserted into the correct position.
   - If they don’t exist, the extension will:
     - Insert the `# Changelog` header at the top of the file.
     - Create a table header with columns for version number, date, type, change, and description.
     - Insert the new changelog entry.

5. **Cleanup:**
   - After inserting the changelog entry, the original command line is removed from your document.

## Usage Tips

- **Place the Command on a Separate Line:**  
  Ensure that your changelog command is on its own line so the extension can correctly detect and process it.

- **Follow the Exact Pattern:**  
  Do not add extra spaces or characters. The command must strictly follow the pattern:
  ```
  cl-<version-type>-<change-type>-<description>--
  ```
  
- **Immediate Update:**  
  As soon as the command is detected, the extension processes it and updates the changelog. There is no need for manual intervention once the command is typed.

## Summary

Simply type your changelog command (e.g., `cl-ma-added-New feature--`) in the editor. The extension takes care of:
- Incrementing the version number based on the type of update.
- Recording the current timestamp.
- Inserting a well-formatted entry into your changelog table.
- Removing the command line after processing.

By following this guide, you can easily maintain an up-to-date changelog that accurately reflects the history of your project's changes.
