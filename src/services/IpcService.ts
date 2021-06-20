import { ipcRenderer } from 'electron';
import WorkLogFactory from '../factories/WorkLogFactory';
import ipcServiceKeys from './const/IpcServiceKeys';

export default class IpcService {
  static emitStopWork(workTime: number, pausedWorkTime: number): void {
    const workLog = WorkLogFactory.createWorkLog(workTime, pausedWorkTime);
    ipcRenderer.send(ipcServiceKeys.stopWork, workLog);
  }

  static emitStartWork(now: Date): void {
    ipcRenderer.send(ipcServiceKeys.startWork, now);
  }
}
