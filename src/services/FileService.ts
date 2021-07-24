import { constants, promises as fs, mkdirSync } from 'fs';
import moment from 'moment';
import path from 'path';
import WorkLogFactory from '../factories/WorkLogFactory';
import { IWorkLog } from '../models/models';

export default class FileService {
  static currentYear: number = moment().year();
  static currentWeek: number = moment().isoWeek();
  static currentDate: string = moment().format('YYMMDD');
  static pathChunks: Array<string> = [
    __dirname,
    '..',
    'worklogs',
    FileService.currentYear.toString(),
    FileService.currentWeek.toString(),
  ];

  static newFilePath: string = path.join(
    ...FileService.pathChunks,
    `${FileService.currentDate}.json`
  );

  static newDirectory: string = path.join(...FileService.pathChunks);

  static async listDirectories(): Promise<string[]> {
    try {
      const directories = await fs.readdir(FileService.newDirectory);
      return directories;
    } catch (error) {
      throw new Error('Cannot list directories.');
    }
  }

  static ensureDirectoryExists() {
    try {
      return mkdirSync(FileService.newDirectory, { recursive: true });
    } catch (error) {
      throw new Error('Directory cannot be created.');
    }
  }

  static async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath, constants.F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  static async saveWorkLogFile(workLog: IWorkLog): Promise<void> {
    try {
      const fileExists = await FileService.fileExists(FileService.newFilePath);
      if (fileExists) {
        await FileService.appendToExistingFile(workLog);
      } else {
        await FileService.createNewFile(workLog);
      }
    } catch (error) {
      throw new Error('Cannot save file.');
    }
  }

  static async readFile(filePath: string) {
    try {
      const file = await fs.readFile(filePath, 'utf8');
      const parsedFile = JSON.parse(file);
      return parsedFile;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async appendToExistingFile(newWorkLog: IWorkLog) {
    try {
      const currentFile = await FileService.readFile(FileService.newFilePath);
      const appendedWorkLog = WorkLogFactory.createAppendedWorkLog(currentFile, newWorkLog);
      const stringifiedAppendedWorkLog = FileService.getPrettifiedJson(appendedWorkLog);
      await fs.writeFile(FileService.newFilePath, stringifiedAppendedWorkLog);
    } catch (error) {
      throw new Error('Cannot append to existing file.');
    }
  }

  static async createNewFile(workLog: IWorkLog) {
    try {
      const stringifiedWorkLog = FileService.getPrettifiedJson(workLog);
      await fs.writeFile(FileService.newFilePath, stringifiedWorkLog);
    } catch (error) {
      throw new Error('Cannot create new file.');
    }
  }

  static getPrettifiedJson(workLog: IWorkLog): string {
    try {
      return JSON.stringify(workLog, null, 2);
    } catch (error) {
      throw new Error('Cannot stringify.');
    }
  }

  static async readWorkLogs(): Promise<IWorkLog[]> {
    FileService.ensureDirectoryExists();

    const fileNames = await fs.readdir(FileService.newDirectory);
    const filePaths = fileNames.map((fileName) => path.join(...FileService.pathChunks, fileName));

    return new Promise((resolve, reject) => {
      const workLogs: Array<IWorkLog> = [];
      const promises = filePaths.map((filePath: string) => {
        return fs
          .readFile(filePath, 'utf8')
          .then((workLog) => {
            const parsedWorkLog: IWorkLog = JSON.parse(workLog);
            workLogs.push(parsedWorkLog);
            return workLogs;
          })
          .catch((error) => {
            throw new Error(error);
          });
      });
      Promise.all(promises)
        .then(() => {
          resolve(workLogs);
          return workLogs;
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  static async saveWorkLog(workLog: IWorkLog): Promise<void> {
    FileService.ensureDirectoryExists();
    FileService.saveWorkLogFile(workLog);
  }
}
