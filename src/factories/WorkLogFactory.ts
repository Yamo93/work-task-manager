import { IWorkLog } from '../models/models';

export default class WorkLogFactory {
  static createWorkLog(workTime: number, pausedWorkTime: number) {
    const workLog: IWorkLog = {
      workTimeInSeconds: workTime,
      pausedWorkTimeInSeconds: pausedWorkTime,
      date: new Date(),
    };
    return workLog;
  }
}
