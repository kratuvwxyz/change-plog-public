# Changelog Updater Extension

The **Changelog Updater Extension** automates the process of updating your project's changelog directly from your source files. Simply type a specially formatted command in your editor, and the extension will handle the rest by incrementing version numbers, adding timestamps, and inserting a new entry into your changelog table.

## Features

- **Automatic Changelog Updates:**  
  Listens for a specific command pattern in your code and automatically updates your changelog.

- **Version Management:**  
  Supports three types of updates:
  - **Major (`ma`):** Increments the major version (e.g., `1.2.3` to `2.0.0`).
  - **Minor (`mi`):** Increments the minor version (e.g., `1.2.3` to `1.3.0`).
  - **Patch (`pa`):** Increments the patch version (e.g., `1.2.3` to `1.2.4`).

- **Detailed Logging:**  
  Each entry includes the new version number, the date and time (formatted as `YY‑MM‑DD <br> HH:MM`), and a description of the change.

- **Seamless Workflow:**  
  After processing, the original command line is automatically removed, keeping your code clean.

## Command Format

To trigger a changelog update, insert a command on its own line using the following format:

```
cl-<version-type>-<change-type>-<description>--
```

### Components:

- **version-type:**  
  - `ma` — Major Update  
  - `mi` — Minor Update  
  - `pa` — Patch Update

- **change-type:**  
  Accepted values are: `added`, `changed`, `deprecated`, `fixed`, `removed`, `secured`.

- **description:**  
  A short summary of the change you’re making.

### Examples:

#### Example 1: Adding a New Security Layer (Minor Update)

Command:
```
cl-mi-secured-Added new security layer on login.--
```

After this command is detected, the extension will:
- Increment the version (e.g., from `1.0.0` to `1.1.0`).
- Log the current date and time.
- Insert a new entry into the changelog table.

**Video Demonstration:**

<video controls width="600" src="resources/SMM01.mp4"></video>  
*If your markdown viewer does not support embedded videos, click [here](resources/SMM01.mp4) to watch the demonstration.*

---

#### Example 2: Fixing a Bug (Patch Update)

Command:
```
cl-pa-fixed-Login issue and server error on Safari browser.--
```

After this command is detected, the extension will:
- Increment the patch version (e.g., from `1.1.0` to `1.1.1`).
- Log the current date and time.
- Insert a new bug fix entry into the changelog table.

**Video Demonstration:**

<video controls width="600" src="resources/SMM02.mp4"></video>  
*If your markdown viewer does not support embedded videos, click [here](resources/SMM02.mp4) to watch the demonstration.*

---

## How It Works

1. **Detection:**  
   The extension monitors your document for text changes. When it finds a line matching the command pattern, it triggers the update process.

2. **Parsing:**  
   The command is parsed into:
   - **Version Type:** (`ma`, `mi`, or `pa`)
   - **Change Type:** (`added`, `changed`, `deprecated`, `fixed`, `removed`, or `secured`)
   - **Description:** A short explanation of the change.

3. **Changelog Update:**  
   - Retrieves the current version from your changelog (if available) and increments it appropriately.
   - Generates a new table row containing the version, timestamp, update type, change type, and description.
   - Inserts the new row into your changelog. If the changelog table or header does not exist, it creates them.

4. **Cleanup:**  
   After updating the changelog, the original command line is removed from your document.

## Installation

### Via the VS Code Marketplace

1. Open VS Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar.
3. Search for "Changelog Updater Extension" and click **Install**.

### Manual Installation

1. Clone this repository.
2. Open the project folder in VS Code.
3. Press `F5` to launch a new VS Code window with the extension loaded.


## **Contributing**

We welcome your contributions to enhance ALPHANUM! Check out our [Contributing Guidelines](https://github.com/kratuvwxyz/CONTRIBUTE) to get started.



## **License**

This project is licensed under the [MIT License](https://github.com/kratuvwxyz/LICENSE).  
© 2025 Kratu Desai, **DESAIGN LLC**



## **How to Contact?**

Whether you're a recruiter seeking top talent or a potential client with a project in mind, I'm eager to hear from you. Let's discuss your needs, aspirations, and how I can help bring your vision to life. From exploring job opportunities to collaborating on exciting projects, I'm here to engage in meaningful conversations.

📧 Email: [mail@thegenius.one](mailto:mail@thegenius.one?subject=Message%20from%20Github&body=Thank%20you%20for%20your%20time%20and%20consideration.%0A%0A%0APlease%20fill%20out%20the%20following%20information:%0A%0A%20*%20Full%20Name:%20%0A%0A%20*%20Are%20you%20a%20recruiter?%20(Yes/No):%20%0A%0A%20*%20LinkedIn%20Profile%20(Optional):%20%0A%0A%20*%20Company%20Name:%20%0A%0A%20*%20Company%20Location:%20%0A%0A%20*%20Email%20Address:%20%0A%0A%20*%20Phone%20Number%20(Optional):%20%0A%0A%20*%20Position%20Title:%20%0A%0A%20*%20Company%20Website:%20%0A%0A%20*%20Message%20or%20Reason%20for%20Contact:%20%0A%0A%20*%20Preferred%20Method%20of%20Contact:%20%0A%0A%20*%20How%20did%20you%20hear%20about%20me?%20(Optional):%20%0A%0A%20*%20Any%20Additional%20Information:%20%0A%0A)




## **About DESAIGN STUDIO**

<img src="https://desaign.app/clients/cli/images/logo/desaign-logo-black.png" alt="DESAIGN LLC Logo" width="250px">

Founded in 2011 by [Kratu Desai](https://desaigner.info), **DESAIGN STUDIO** is committed to innovation and excellence in design and technology. Check out our latest projects and see how we bring creativity to life at [desaign.studio](https://desaign.app).


<span><a href="https://www.facebook.com/desaignstudio" target="_blank" style="text-decoration:none;"><img src="https://desaign.app/clients/cli/images/1x/029-facebook.png" alt="Facebook" width="25" /></a></span>&#160;
<span><a href="https://www.twitter.com/desaignstudio" target="_blank" style="text-decoration:none;"><img src="https://desaign.app/clients/cli/images/1x/030-twitter.png" alt="Twitter" width="25" /></a></span>&#160;
<span><a href="https://www.linkedin.com/company/desaignstudio" target="_blank" style="text-decoration:none;"><img src="https://desaign.app/clients/cli/images/1x/038-linkedin.png" alt="LinkedIn" width="25" /></a></span>&#160;
<span><a href="https://desaigner.info" target="_blank" style="text-decoration:none;"><img src="https://desaign.app/clients/cli/images/1x/011-blog.png" alt="DESAIGNER Blog" width="25" /></a></span>

© 2011-2025. All Rights Reserved.