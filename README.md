# Canvas Note Same Folder

An Obsidian plugin that automatically organizes notes created from Canvas views into the folder on the same level as the canvas.

See explanation video:
[https://drive.proton.me/urls/GKKCX2QHK8#Ouwo12AWBAjO
](url)
## Description

When you create a new note from within an Obsidian Canvas (via wiki links like `[[New Note]]` or by adding new cards), this plugin automatically places it into a folder named `elements-of_{canvas_name}` at the same level as the canvas file.

This fixes the known issue where Canvas-created notes default to the vault root instead of respecting the "Default location for new notes" setting.

## Features

- ✅ Automatically detects notes created from Canvas views
- ✅ Creates `elements-of_{canvas_name}` folder if it doesn't exist
- ✅ Handles naming conflicts by appending numbers (e.g., "Note 1.md", "Note 2.md")
- ✅ Only affects notes created from Canvas (doesn't interfere with normal note creation)
- ✅ Works with canvas files at any folder level

## Installation

### Via BRAT (Beta Reviewers Auto-update Tool)

1. Install the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat) if you haven't already
2. Open Obsidian Settings → Community plugins → BRAT
3. Click "Add Beta Plugin"
4. Enter the GitHub repository URL for this plugin
5. Enable the plugin in Settings → Community plugins

### Manual Installation

1. Download the latest release from GitHub
2. Extract the files to your vault's `.obsidian/plugins/canvas-note-same-folder/` folder
3. Reload Obsidian
4. Enable the plugin in Settings → Community plugins

## Usage

1. Open a Canvas file in Obsidian
2. Create a new note from within the canvas (e.g., type `[[New Note]]` and click to create)
3. The note will automatically be moved to `elements-of_{canvas_name}/` folder at the same level as your canvas file

### Example

If you have a canvas file at:
```
projects/my-project.canvas
```

And you create a note `[[Test Note]]` from within that canvas, it will be placed at:
```
projects/elements-of_my-project/Test Note.md
```

## Building from Source

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the plugin
4. The `main.js` file will be generated in the root directory

## Requirements

- Obsidian version 1.5.0 or higher

## Version

v0.0.1_1

## License

MIT

