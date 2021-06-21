import { ipcRenderer, IpcRendererEvent } from 'electron';
import WorkLogFactory from '../factories/WorkLogFactory';
import { IWorkLog } from '../models/models';
import ipcServiceKeys from './const/IpcServiceKeys';

export default class IpcService {
  static async listenToReadWorkLogs(): Promise<Array<IWorkLog>> {
    let logs: Array<IWorkLog> = [];
    await ipcRenderer.once(
      ipcServiceKeys.readWorkLogs,
      (_event: IpcRendererEvent, workLogs: Array<IWorkLog>) => {
        logs = workLogs;
      }
    );
    return logs;
  }

  static listenToToggleDarkMode(callback: () => void) {
    ipcRenderer.once(ipcServiceKeys.toggleDarkMode, callback);
  }

  static readWorkLogs() {
    ipcRenderer.send(ipcServiceKeys.readWorkLogs);
  }

  static emitStopWork(workTime: number, pausedWorkTime: number): void {
    const workLog = WorkLogFactory.createWorkLog(workTime, pausedWorkTime);
    ipcRenderer.send(ipcServiceKeys.stopWork, workLog);
  }

  static emitStartWork(now: Date): void {
    ipcRenderer.send(ipcServiceKeys.startWork, now);
  }
}
