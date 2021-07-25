import { v4 as uuidv4 } from 'uuid';
import { IFactory } from '../interfaces/IFactory';
import WorkLog, { IWorkLog } from '../models/WorkLog';

export default class WorkLogFactory implements IFactory<IWorkLog> {
  updatedFile: WorkLog | undefined;
  file!: WorkLog | undefined;
  folderName: string;

  constructor() {
    this.folderName = 'worklogs';
  }

  create({ workTimeInSeconds: workTime, pausedWorkTimeInSeconds: pausedWorkTime }: IWorkLog) {
    const workLog = new WorkLog({
      id: uuidv4(),
      workTimeInSeconds: workTime,
      pausedWorkTimeInSeconds: pausedWorkTime,
      date: new Date(),
    });
    this.file = workLog;
    return workLog;
  }

  update(oldWorkLog: IWorkLog, newWorkLog: IWorkLog) {
    const { workTimeInSeconds: oldWorkTime, pausedWorkTimeInSeconds: oldPausedTime } = oldWorkLog;
    const { workTimeInSeconds: newWorkTime, pausedWorkTimeInSeconds: newPausedTime } = newWorkLog;
    const updatedWorkLog = new WorkLog({
      ...oldWorkLog,
      workTimeInSeconds: oldWorkTime + newWorkTime,
      pausedWorkTimeInSeconds: oldPausedTime + newPausedTime,
      date: new Date(),
    });
    this.updatedFile = updatedWorkLog;
    return updatedWorkLog;
  }
}
