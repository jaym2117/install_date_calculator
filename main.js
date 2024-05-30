const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const xlsx = require('xlsx');

let leadTimes = {};

function readLeadTimes() {
  const workbook = xlsx.readFile('F:\lead_times.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);
  
  data.forEach(row => {
    leadTimes[row['Project Type']] = {
      minWeeks: row['Min Weeks'],
      maxWeeks: row['Max Weeks']
    };
  });
}

function createWindow() {
  readLeadTimes(); // Read the lead times when the app starts

  const mainWindow = new BrowserWindow({
    width: 900,
    height: 900,
    // autoHideMenuBar: true, 
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('get-lead-times', async () => {
  return leadTimes;
});

