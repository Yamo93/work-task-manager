import { ipcRenderer } from 'electron';
import ipcServiceKeys from './const/IpcServiceKeys';

export default class IpcService {
  static emitStopWork(): void {
    ipcRenderer.send(ipcServiceKeys.stopWork);
  }

  static emitStartWork(now: Date): void {
    ipcRenderer.send(ipcServiceKeys.startWork, now);
  }
}
