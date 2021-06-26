import { ipcRenderer, IpcRendererEvent } from 'electron';
import WorkLogFactory from '../factories/WorkLogFactory';
import { IWorkLog } from '../models/models';
import ipcServiceKeys from './const/IpcServiceKeys';

type ListenToReadWorkLogsCallback = (
  event: IpcRendererEvent,
  logs: Array<IWorkLog>
) => void;

export default class IpcService {
  static listenToReadWorkLogs(callback: ListenToReadWorkLogsCallback): void {
    ipcRenderer.once(ipcServiceKeys.readWorkLogs, callback);
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
