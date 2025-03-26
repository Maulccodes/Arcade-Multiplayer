const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'dist/renderer/index.html'));
    
    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    createWindow();

    // Handle ROM file selection
    ipcMain.handle('select-rom', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'ROM Files', extensions: ['nes', 'smc', 'gb', 'gbc', 'gba', 'z64', 'n64'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });
        
        if (canceled || filePaths.length === 0) {
            return null;
        }
        
        try {
            const romPath = filePaths[0];
            const romData = fs.readFileSync(romPath);
            return {
                path: romPath,
                data: romData.toString('base64'),
                name: path.basename(romPath)
            };
        } catch (error) {
            console.error('Error reading ROM file:', error);
            return { error: error.message };
        }
    });

    // Handle save state
    ipcMain.handle('save-state', async (event, { data, slot, gameName }) => {
        try {
            const saveDir = path.join(app.getPath('userData'), 'saves');
            
            // Create saves directory if it doesn't exist
            if (!fs.existsSync(saveDir)) {
                fs.mkdirSync(saveDir, { recursive: true });
            }
            
            const savePath = path.join(saveDir, `${gameName}_slot${slot}.sav`);
            fs.writeFileSync(savePath, Buffer.from(data, 'base64'));
            
            return { success: true, path: savePath };
        } catch (error) {
            console.error('Error saving state:', error);
            return { error: error.message };
        }
    });

    // Handle load state
    ipcMain.handle('load-state', async (event, { slot, gameName }) => {
        try {
            const saveDir = path.join(app.getPath('userData'), 'saves');
            const savePath = path.join(saveDir, `${gameName}_slot${slot}.sav`);
            
            if (!fs.existsSync(savePath)) {
                return { error: 'Save file does not exist' };
            }
            
            const data = fs.readFileSync(savePath);
            return { data: data.toString('base64') };
        } catch (error) {
            console.error('Error loading state:', error);
            return { error: error.message };
        }
    });

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});