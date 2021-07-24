/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, ipcMain, Menu, nativeImage, shell, Tray } from 'electron';
import MenuBuilder from './menu';
import AppUpdater from './auto-updater';
import FileService from './services/FileService';
import { IWorkLog } from './models/models';

export default class Main {
  static mainWindow: Electron.BrowserWindow | null = null;
  static application: Electron.App;
  static BrowserWindow: typeof BrowserWindow;
  static startTimeForWork: Date;
  static stopTimeForWork: Date;
  static tray: Tray;

  private static onWindowAllClosed(): void {
    if (process.platform === 'darwin') {
      app.dock.hide();
    }
    // use same logic for other OSes you want
  }

  private static onMainWindowClosed(): void {
    Main.mainWindow = null;
  }

  private static onNewWindow(event: Event, url: string): void {
    event.preventDefault();
    shell.openExternal(url);
  }

  private static onDidFinishLoad(): void {
    if (!Main.mainWindow) {
      throw new Error('"Main.mainWindow" is not defined.');
    }
    if (process.env.START_MINIMIZED) {
      Main.mainWindow.minimize();
    } else {
      Main.mainWindow.show();
      Main.mainWindow.focus();
    }
  }

  private static onToggleDarkMode(): void {
    if (!Main.mainWindow) {
      throw new Error('"Main.mainWindow" is not defined.');
    }
    Main.mainWindow.webContents.send('toggle-dark-mode');
  }

  private static onStartWork(_event: Event, now: Date): void {
    Main.startTimeForWork = now;
  }

  private static async onStopWork(_event: Event, workLog: IWorkLog): Promise<void> {
    Main.stopTimeForWork = new Date(Date.now());
    await FileService.saveWorkLog(workLog);
    await Main.onReadWorkLogs();
  }

  private static async installExtensions() {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS'];

    return installer
      .default(
        extensions.map((name) => installer[name]),
        forceDownload
      )
      .catch(console.log);
  }

  private static getResourcesPath(): string {
    return app.isPackaged
      ? path.join(process.resourcesPath, 'assets')
      : path.join(__dirname, '../assets');
  }

  private static getAssetPath(resourcesPath: string, ...paths: string[]): string {
    return path.join(resourcesPath, ...paths);
  }

  private static buildBrowserWindow(resourcesPath: string): BrowserWindow {
    const browserWindow = new BrowserWindow({
      show: false,
      width: 1024,
      height: 728,
      icon: Main.getAssetPath(resourcesPath, 'icon.png'),
      webPreferences: {
        nodeIntegration: true,
      },
    });
    return browserWindow;
  }

  private static buildMenu(mainWindow: BrowserWindow): void {
    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();
  }

  private static setupWindowListeners(): void {
    if (!Main.mainWindow) {
      throw new Error('"Main.mainWindow" is not defined.');
    }
    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    Main.mainWindow.webContents.on('did-finish-load', Main.onDidFinishLoad);

    Main.mainWindow.on('closed', Main.onMainWindowClosed);

    // Open urls in the user's browser
    Main.mainWindow.webContents.on('new-window', Main.onNewWindow);
  }

  private static setupIpcListeners(): void {
    ipcMain.on('toggle-dark-mode', Main.onToggleDarkMode);
    ipcMain.on('start-work', Main.onStartWork);
    ipcMain.on('stop-work', Main.onStopWork);
    ipcMain.on('read-worklogs', Main.onReadWorkLogs);
    ipcMain.on('app-quit', Main.onAppQuit);
  }

  static onAppQuit() {
    const choice = require('electron').dialog.showMessageBoxSync(Main.mainWindow, {
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Confirm quit',
      message: 'Are you sure you want to quit?',
    });
    const isYes = choice === 0;
    if (isYes) {
      app.quit();
    }
  }

  static async onReadWorkLogs() {
    try {
      const workLogs = await FileService.readWorkLogs();
      Main.mainWindow?.webContents.send('read-worklogs', workLogs);
    } catch (error) {
      throw new Error(error);
    }
  }

  private static setupApplicationListeners(): void {
    Main.application.on('window-all-closed', Main.onWindowAllClosed);
    Main.application.on('ready', Main.onReady);
    Main.application.on('activate', Main.onActivate);
  }

  private static async createWindow() {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
      await Main.installExtensions();
    }

    const RESOURCES_PATH = Main.getResourcesPath();

    Main.mainWindow = Main.buildBrowserWindow(RESOURCES_PATH);

    Main.mainWindow.loadURL(`file://${__dirname}/index.html`);

    Main.setupWindowListeners();

    Main.buildMenu(Main.mainWindow);

    Main.setupIpcListeners();

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    new AppUpdater();
  }

  private static createTray() {
    const RESOURCES_PATH = Main.getResourcesPath();
    const icon = Main.getAssetPath(RESOURCES_PATH, 'icon.png');
    const trayIcon = nativeImage.createFromPath(icon);
    Main.tray = new Tray(trayIcon.resize({ width: 16 }));
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show App',
        click: () => {
          Main.createWindow();
        },
      },
      {
        label: 'Quit',
        click: () => {
          ipcMain.emit('app-quit');
        },
      },
    ]);

    Main.tray.setContextMenu(contextMenu);
  }

  private static async onReady() {
    await Main.createWindow();
    Main.createTray();
  }

  private static onActivate() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (Main.mainWindow === null) Main.createWindow();
  }

  static main(application: Electron.App, browserWindow: typeof BrowserWindow) {
    if (process.env.NODE_ENV === 'production') {
      const sourceMapSupport = require('source-map-support');
      sourceMapSupport.install();
    }

    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
      require('electron-debug')();
    }

    // we pass the Electron.App object and the
    // Electron.BrowserWindow into this function
    // so this class has no dependencies. This
    // makes the code easier to write tests for
    Main.BrowserWindow = browserWindow;
    Main.application = application;

    Main.setupApplicationListeners();
  }
}

Main.main(app, BrowserWindow);
