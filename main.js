const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;


let mainWindow;

function createWindow () {

  const screen = require('screen');
  let windowSize = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({width: 450, height: windowSize.height});
  mainWindow.setPosition(windowSize.width - 450, 0);

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
