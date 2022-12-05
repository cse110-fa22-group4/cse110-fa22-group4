// main.js

// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require('path');
const {argv} = require('process');
const htmlPath = __dirname + '/source/musicplayer/html';
const fsAPITester = require('../testing/fsAPITesting/fsAPITester');
const { globalShortcut } = require('electron');

let selectedSong = '';
let mainWindow;

const createWindow = async () => {
	// Create the browser window.
	mainWindow = new BrowserWindow({
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

	mainWindow.on('focus', () => {
		mainWindow.webContents.send('window-focused');
	});

	mainWindow.on('blur', () => {
		mainWindow.webContents.send('window-unfocused');
	});

	mainWindow.on('closed', () => {

	});

	// maximize window at start
	// mainWindow.maximize();

	// and load the index.html of the app.
	await mainWindow.loadFile(path.join(__dirname, '/../html/index.html'));

    // hide menu bar on windows
    await mainWindow.setMenuBarVisibility(false);

	// Open the DevTools.
	// await mainWindow.webContents.openDevTools()

	// Check for testing flag to run tests (npm run test)
	if (argv.length === 3 && argv[2] === '-g') {
		await fsAPITester.testAll();
	}

	// add mainWindow to global
	// probably can't make mainWindow global 
	//await genAPI.publishGlobal(mainWindow, 'mainWindow');
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

	globalShortcut.register('CmdOrCtrl+R', () => {
		//Disable it
	});
	globalShortcut.register('CmdOrCtrl+Shift+R', () => {
		//Disable it
	});

	app.on('browser-window-focus', () => {
		globalShortcut.register('CmdOrCtrl+R', () => {

		});
		globalShortcut.register('CmdOrCtrl+Shift+R', () => {

		});
	})
	app.on('browser-window-blur', () => {
		globalShortcut.unregister('CmdOrCtrl+R');
		globalShortcut.unregister('CmdOrCtrl+Shift+R');
	})
	/*
	await globalShortcut.unregister('CmdOrCtrl+R');
	await globalShortcut.unregister('CmdOrCtrl+Shift+R');
	globalShortcut.register('CmdOrCtrl+R', () => { });
	globalShortcut.register('CmdOrCtrl+Shift+R', () => { });
	*/
});


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('before-quit', async () => {
	await mainWindow.webContents.send('window-closed');
	if (process.platform !== 'darwin') app.quit();
});

app.on('window-all-closed', async () => {
	if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('quit', () => {
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

