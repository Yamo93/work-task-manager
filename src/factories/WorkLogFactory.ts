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
}
