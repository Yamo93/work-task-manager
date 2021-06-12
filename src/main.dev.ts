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
import { app, BrowserWindow, shell } from 'electron';
import MenuBuilder from './menu';
import AppUpdater from './auto-updater';

export default class Main {
  static mainWindow: Electron.BrowserWindow | null = null;
  static application: Electron.App;
  static BrowserWindow: typeof BrowserWindow;

  private static onWindowAllClosed(): void {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
      app.quit();
    }
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
      throw new Error('"Main.mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      Main.mainWindow.minimize();
    } else {
      Main.mainWindow.show();
      Main.mainWindow.focus();
    }
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

  private static getAssetPath(
    resourcesPath: string,
    ...paths: string[]
  ): string {
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
      throw new Error('"Main.mainWindow" is not defined');
    }
    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    Main.mainWindow.webContents.on('did-finish-load', Main.onDidFinishLoad);

    Main.mainWindow.on('closed', Main.onMainWindowClosed);

    // Open urls in the user's browser
    Main.mainWindow.webContents.on('new-window', Main.onNewWindow);
  }

  private static async createWindow() {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      await Main.installExtensions();
    }

    const RESOURCES_PATH = Main.getResourcesPath();

    Main.mainWindow = Main.buildBrowserWindow(RESOURCES_PATH);

    Main.mainWindow.loadURL(`file://${__dirname}/index.html`);

    Main.setupWindowListeners();

    Main.buildMenu(Main.mainWindow);

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    new AppUpdater();
  }

  private static async onReady() {
    await Main.createWindow();
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

    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      require('electron-debug')();
    }

    // we pass the Electron.App object and the
    // Electron.BrowserWindow into this function
    // so this class has no dependencies. This
    // makes the code easier to write tests for
    Main.BrowserWindow = browserWindow;
    Main.application = application;
    Main.application.on('window-all-closed', Main.onWindowAllClosed);
    Main.application.on('ready', Main.onReady);
    Main.application.on('activate', Main.onActivate);
  }
}

Main.main(app, BrowserWindow);
