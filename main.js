const electron = require('electron');
const path = require('path');
const url = require('url');


process.env.NODE_ENV = 'development';

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

app.on('ready', function(){
  // Create new window
  mainWindow = new BrowserWindow({});
  // Load html in window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Quit app when closed
  mainWindow.on('closed', function(){
    app.quit();
  });

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

//  Add item window
function NotepadWindow(){
  var child = require('child_process').execFile;
  var executablePath = "notepad.exe";
  
  child(executablePath,function(err, data) {
       console.log(err)
       console.log(data.toString());
  });
}
function MSpaintWindow(){
  var child = require('child_process').execFile;
  var executablePath = "mspaint.exe";
  
  child(executablePath,function(err, data) {
       console.log(err)
       console.log(data.toString());
  });
}


//  Item:add
ipcMain.on('item:add', function(e, item){
  mainWindow.webContents.send('item:add', item);
  addWindow.close(); 
   //addWindow = null;
});

// Create menu 
const mainMenuTemplate =  [
 
  {
    label: 'File',
    submenu:[
      {
        label:'NotePad',
        click(){
          NotepadWindow();
        }
      },
      {
        label:'MS Paint',
        click(){
         MSpaintWindow();
        }
      },
    
      {
        label: 'Quit',
        accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
];


if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}