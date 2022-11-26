// main.js

// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require('path');
const {argv} = require('process');
const htmlPath = __dirname + '/source/musicplayer/html';
const fsAPITester = require('../testing/fsAPITesting/fsAPITester');

let selectedSong = '';

const createWindow = async () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 1920,
		height: 1080,
		minHeight: 720,
		minWidth: 1080,
		webPreferences: {
			preload: path.join(__dirname, '/../preload/preload.js'),
			sandbox: false,
			contextIsolation: true,
		},
	});

	// maximize window at start
	// mainWindow.maximize();

	// and load the index.html of the app.
	await mainWindow.loadFile(path.join(__dirname, '/../html/index.html'));
	mainWindow.on('closed', () => {
		ipcMain.emit('window-closed');
	});


	// Open the DevTools.
	// mainWindow.webContents.openDevTools()

	// Check for testing flag to run tests (npm run test)
	if (argv.length === 3 && argv[2] === '-g') {
		await fsAPITester.testAll();
	}
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
	await createWindow();

	app.on('activate', () => {
		// On macOS, it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});

	//
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('before-quit', async () => {
	ipcMain.emit('window-closed');
	//if(process.platform !== 'darwin') await ffmpegAPI.stopSong();
});
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// This is where ipc security checks are being done.
// TODO: Abstract this out to a separate "IPC Security" file.
ipcMain.handle('managedAttributeCheck', (event, args) => {
	return true; // TODO: Add security!
});
ipcMain.handle('managedAddEventListenerCheck', (event, args) => {
	return true; // TODO: Add security!
});
ipcMain.handle('getUserData', (event, args) => {
	return app.getPath('userData'); // No security needed, just returns a path to user data.
});
ipcMain.handle('getAppPath', (event, args) => {
	return app.getAppPath();
});
ipcMain.handle('getTempPath', (event, args) => {
	return app.getPath('temp');
});
ipcMain.handle('managedValueCheck', (event, args) => {
	return true; // TODO: Add security!
});
ipcMain.handle('managedChildCheck', (event, args) => {
	return true;
});
ipcMain.handle('openDialog', async (event, args) => {
	return JSON.stringify(await dialog.showOpenDialog(args));
});
ipcMain.handle('get-selected-song', (event, args) => {
	return selectedSong;
});
ipcMain.handle('set-selected-song', (event, args) => {
	selectedSong = args;
});

