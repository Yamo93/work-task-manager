import { promises as fs, mkdir, mkdirSync } from 'fs';
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

  static newDirectory: string = path.join(...FileService.pathChunks);

  static async listDirectories(): Promise<string[]> {
    return fs.readdir(FileService.newDirectory);
  }

  static ensureDirectoryExists() {
    return mkdirSync(FileService.newDirectory, { recursive: true });
  }

  static async readWorkLogs(): Promise<IWorkLog[]> {
    try {
      FileService.ensureDirectoryExists();
    } catch (error) {
      throw new Error('Directory cant be created.');
    }
    const fileNames = await fs.readdir(FileService.newDirectory);
    const filePaths = fileNames.map((fileName) =>
      path.join(...FileService.pathChunks, fileName)
    );

    return new Promise((resolve, reject) => {
      const workLogs: Array<IWorkLog> = [];
      const promises = filePaths.map((filePath) => {
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

  static saveWorkLog(workLog: IWorkLog): void {
    const newFilePath = path.join(
      ...FileService.pathChunks,
      `${FileService.currentDate}.json`
    );
    const stringifiedWorkLog = JSON.stringify(workLog, null, 2);
    mkdir(FileService.newDirectory, { recursive: true }, (err) => {
      if (err) throw err;

      fs.writeFile(newFilePath, stringifiedWorkLog);
    });
  }
}
