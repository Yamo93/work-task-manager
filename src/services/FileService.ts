import { promises as fs, mkdirSync } from 'fs';
import moment from 'moment';
import path from 'path';
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
      throw new Error('Cannot list directories');
    }
  }

  static ensureDirectoryExists() {
    try {
      return mkdirSync(FileService.newDirectory, { recursive: true });
    } catch (error) {
      throw new Error('Directory cannot be created.');
    }
  }

  static async saveWorkLogFile(workLog: IWorkLog): Promise<void> {
    const stringifiedWorkLog = FileService.getPrettifiedJson(workLog);
    await FileService.writeFile(stringifiedWorkLog);
  }

  static async writeFile(fileContent: string) {
    try {
      await fs.writeFile(FileService.newFilePath, fileContent);
    } catch (error) {
      throw new Error('Cannot write file');
    }
  }

  static getPrettifiedJson(workLog: IWorkLog): string {
    try {
      return JSON.stringify(workLog, null, 2);
    } catch (error) {
      throw new Error('Cannot stringify');
    }
  }

  static async readWorkLogs(): Promise<IWorkLog[]> {
    FileService.ensureDirectoryExists();

    const fileNames = await fs.readdir(FileService.newDirectory);
    const filePaths = fileNames.map((fileName) =>
      path.join(...FileService.pathChunks, fileName)
    );

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
