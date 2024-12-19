import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,  // Disable context isolation temporarily to test
            enableRemoteModule: true, // Disable Remote Module
            nodeIntegration: true,  // You can also enable Node.js integration for testing (be cautious)
        },
    });

    //mainWindow.webContents.openDevTools();  // Open DevTools to inspect for any issues

    // Load the React app during development
    // mainWindow.loadURL('http://localhost:5173');  // Un-comment this if running in development mode
    mainWindow.loadURL(`file://${__dirname}/dist/index.html`);
    // Load production build when packaged
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        // Recreate the window if all are closed (macOS behavior)
        mainWindow = new BrowserWindow();
    }
});
