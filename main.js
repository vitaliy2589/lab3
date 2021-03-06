const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

process.env.NODE_ENV = 'development';

let mainWindow;
let addWindow;

app.on('ready', function(){
   mainWindow = new BrowserWindow({});
   mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'mainWindow.html'),
      protocol: 'file:',
      slashes: true
   }));

   mainWindow.on('closed', function(){
     app.quit();
   });

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow(){
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Додати продукт до списку'
  });
  addWindow.loadURL(url.format({
     pathname: path.join(__dirname, 'addWindow.html'),
     protocol: 'file:',
     slashes: true
  }));
  addWindow.on('close', function(){
    addWindow.null;
  });
}

ipcMain.on('item:add', function(e, item){

     mainWindow.webContents.send('item:add', item);
     addWindow.close();
});

const mainMenuTemplate = [
  {
    label:'Файл',
    submenu: [
      {
        label: 'Додати елемент',
        click(){
          createAddWindow();
        }
      },
      {
        label: 'Видалити елемент',
        click(){
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Вийти',
        accelerator: process.platform == 'darwin' ? 'Command+Q' :
        'Ctrl+Q',
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
    label: 'Інструменти розробника',
    submenu: [
      {
        label: 'Переключити DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' :
        'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}
