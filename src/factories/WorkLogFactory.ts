import { v4 as uuidv4 } from 'uuid';
import { IWorkLog } from '../models/models';

export default class WorkLogFactory {
  static createWorkLog(workTime: number, pausedWorkTime: number) {
    const workLog: IWorkLog = {
      id: uuidv4(),
      workTimeInSeconds: workTime,
      pausedWorkTimeInSeconds: pausedWorkTime,
      date: new Date(),
    };
    return workLog;
  }

  static createAppendedWorkLog(oldWorkLog: IWorkLog, newWorkLog: IWorkLog) {
    const { workTimeInSeconds: oldWorkTime, pausedWorkTimeInSeconds: oldPausedTime } = oldWorkLog;
    const { workTimeInSeconds: newWorkTime, pausedWorkTimeInSeconds: newPausedTime } = newWorkLog;
    const appendedWorkLog: IWorkLog = {
      ...oldWorkLog,
      workTimeInSeconds: oldWorkTime + newWorkTime,
      pausedWorkTimeInSeconds: oldPausedTime + newPausedTime,
      date: new Date(),
    };
    return appendedWorkLog;
  }
}
