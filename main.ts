// added: Full implementation of canvas note folder plugin with automatic folder creation and conflict resolution
// VERSION: v0.0.1_1
import { Plugin, TFile, TAbstractFile } from 'obsidian';

export default class CanvasNoteSameFolderPlugin extends Plugin {
    async onload() {
        // Register event when a new file is created
        this.registerEvent(
            this.app.vault.on('create', async (file: TAbstractFile) => {
                await this.handleFileCreation(file);
            })
        );
    }

    /**
     * Main handler for file creation events
     */
    async handleFileCreation(file: TAbstractFile): Promise<void> {
        if (!(file instanceof TFile)) return;
        
        // Only process markdown files
        if (!file.path.endsWith('.md')) return;
        
        // Check if file was created from canvas
        if (!this.isCreatedFromCanvas(file)) return;
        
        // Get the active canvas file
        const canvasFile = this.getActiveCanvasFile();
        if (!canvasFile) return;
        
        // Get target folder path
        const targetFolderPath = this.getTargetFolderPath(canvasFile);
        if (!targetFolderPath) return;
        
        // Skip if file is already in the correct folder
        if (file.parent?.path === targetFolderPath) return;
        
        // Ensure target folder exists
        await this.ensureFolderExists(targetFolderPath);
        
        // Get unique file name (handle conflicts)
        const uniqueFileName = await this.getUniqueFileName(targetFolderPath, file.name);
        const targetPath = `${targetFolderPath}/${uniqueFileName}`;
        
        // Move file to target folder
        await this.moveFileToFolder(file, targetPath);
    }

    /**
     * Check if file was created from a canvas view
     */
    isCreatedFromCanvas(file: TFile): boolean {
        // Check if any canvas view is active
        const canvasLeaves = this.app.workspace.getLeavesOfType('canvas');
        if (canvasLeaves.length === 0) return false;
        
        // Check if file was created in vault root (typical for canvas-created notes)
        const rootPath = this.app.vault.getRoot().path;
        return file.parent?.path === rootPath;
    }

    /**
     * Get the currently active canvas file
     */
    getActiveCanvasFile(): TFile | null {
        const canvasLeaves = this.app.workspace.getLeavesOfType('canvas');
        if (canvasLeaves.length === 0) return null;
        
        // Get the first active canvas leaf
        const activeLeaf = canvasLeaves.find(leaf => {
            const view = leaf.view as any;
            return view?.file instanceof TFile;
        });
        
        if (!activeLeaf) return null;
        
        const view = activeLeaf.view as any;
        const canvasFile = view?.file;
        
        if (canvasFile instanceof TFile && canvasFile.extension === 'canvas') {
            return canvasFile;
        }
        
        return null;
    }

    /**
     * Calculate the target folder path based on canvas file
     */
    getTargetFolderPath(canvasFile: TFile): string | null {
        if (!canvasFile.parent) return null;
        
        const canvasName = canvasFile.basename; // name without .canvas extension
        const canvasParentPath = canvasFile.parent.path;
        
        // Construct folder name: elements-of_{canvas_name}
        const folderName = `elements-of_${canvasName}`;
        
        // Handle root folder case (empty string or '/')
        if (!canvasParentPath || canvasParentPath === '/' || canvasParentPath === '') {
            return folderName;
        }
        
        return `${canvasParentPath}/${folderName}`;
    }

    /**
     * Ensure the target folder exists, create if needed
     */
    async ensureFolderExists(folderPath: string): Promise<void> {
        try {
            // Check if folder already exists
            const folder = this.app.vault.getAbstractFileByPath(folderPath);
            if (folder) return; // Folder exists
            
            // Create folder (createFolder handles nested paths)
            await this.app.vault.createFolder(folderPath);
        } catch (error) {
            // Folder might already exist or there's a permission issue
            // Silently handle - if folder doesn't exist, file move will fail anyway
            console.warn(`Could not create folder ${folderPath}:`, error);
        }
    }

    /**
     * Get a unique file name by appending numbers if conflicts exist
     */
    async getUniqueFileName(folderPath: string, fileName: string): Promise<string> {
        const baseName = fileName.replace(/\.md$/, '');
        const extension = '.md';
        
        // Check if file already exists
        const targetPath = `${folderPath}/${fileName}`;
        const existingFile = this.app.vault.getAbstractFileByPath(targetPath);
        
        if (!existingFile) {
            return fileName; // No conflict
        }
        
        // Find next available number
        let counter = 1;
        let newFileName: string;
        let newPath: string;
        
        do {
            newFileName = `${baseName} ${counter}${extension}`;
            newPath = `${folderPath}/${newFileName}`;
            const file = this.app.vault.getAbstractFileByPath(newPath);
            
            if (!file) {
                return newFileName;
            }
            
            counter++;
        } while (counter < 1000); // Safety limit
        
        // Fallback: append timestamp if we hit the limit
        return `${baseName} ${Date.now()}${extension}`;
    }

    /**
     * Move file to target folder with error handling
     */
    async moveFileToFolder(file: TFile, targetPath: string): Promise<void> {
        try {
            await this.app.fileManager.renameFile(file, targetPath);
        } catch (error) {
            console.error(`Failed to move file ${file.path} to ${targetPath}:`, error);
        }
    }
}
