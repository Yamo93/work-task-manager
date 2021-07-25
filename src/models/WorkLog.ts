import { v4 as uuidv4 } from 'uuid';
import { IFile } from '../interfaces/IFile';

export interface IWorkLog {
  id?: string;
  workTimeInSeconds: number;
  pausedWorkTimeInSeconds: number;
  date?: Date;
}

class WorkLog implements IWorkLog, IFile {
  id: string;
  workTimeInSeconds: number;
  pausedWorkTimeInSeconds: number;
  date: Date;

  constructor(config: IWorkLog) {
    this.id = config.id || uuidv4();
    this.workTimeInSeconds = config.workTimeInSeconds;
    this.pausedWorkTimeInSeconds = config.pausedWorkTimeInSeconds;
    this.date = config.date || new Date();
  }
}

export default WorkLog;
