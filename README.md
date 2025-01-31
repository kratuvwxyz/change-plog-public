# Change-PLOG

## Overview
Change-PLOG is a VS Code extension designed to help developers efficiently manage changelogs. By typing specific commands in Markdown files, it automatically generates version updates with properly formatted changelog entries.

## Features
- Automatically detects changelog updates when typing commands.
- Supports **major, minor, and patch** version increments.
- Provides predefined categories for changelog updates:
    - **Added** for new features.
    - **Changed** for changes in existing functionality.
    - **Deprecated** for soon-to-be removed features.
    - **Removed** for now removed features.
    - **Fixed** for any bug fixes.
    - **Secured** in case of vulnerabilities.
- Auto-inserts formatted changelog entries.
- Prevents duplicate triggers with an execution flag.

## Installation
1. Open VS Code.
2. Go to the **Extensions Marketplace** (`Ctrl+Shift+X`).
3. Search for `Change-PLOG`.
4. Click **Install**.

## Usage
### Automatic Changelog Entry Generation
Type one of the following commands in a **Markdown** file:
```sh
changelog-major-added
changelog-minor-removed
changelog-minor-fixed
```
Once typed, the extension will automatically insert a formatted changelog entry:
```markdown
---

### 1.2.0 - 2025-01-11 11:11

#### FIXED: 
```

### Manual Trigger
To manually insert a changelog entry:
1. Open Command Palette (`Ctrl+Shift+P`).
2. Search for **Trigger Changelog Helper**.
3. Select and execute the command.

## Configuration
No additional configuration is required. The extension activates automatically when working in Markdown files.



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