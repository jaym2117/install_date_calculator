const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getLeadTimes: () => ipcRenderer.invoke('get-lead-times')
});
