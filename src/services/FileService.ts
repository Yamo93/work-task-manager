import { app } from 'electron';
import { constants, promises as fs, mkdirSync } from 'fs';
import moment from 'moment';
import path from 'path';
import { IFactory } from '../interfaces/IFactory';

export default class FileService<File> {
  static currentYear: number = moment().year();
  static currentWeek: number = moment().isoWeek();
  static currentDate: string = moment().format('YYMMDD');
  fileFactory: IFactory<File>;
  folderName: string;

  constructor(fileFactory: IFactory<File>) {
    this.fileFactory = fileFactory;
    this.folderName = fileFactory.folderName;
  }

  getPathChunks(): string[] {
    const userDataPathChunks = app.getPath('userData').split(path.sep);
    return [
      ...userDataPathChunks,
      'data',
      this.folderName,
      FileService.currentYear.toString(),
      FileService.currentWeek.toString(),
    ];
  }

  getNewFilePath(): string {
    const pathChunks = this.getPathChunks();
    return path.join(...pathChunks, `${FileService.currentDate}.json`);
  }

  getNewDirectory(): string {
    const pathChunks = this.getPathChunks();
    return path.join(...pathChunks);
  }

  async listDirectories(): Promise<string[]> {
    try {
      const directories = await fs.readdir(this.getNewDirectory());
      return directories;
    } catch (error) {
      throw new Error(error);
    }
  }

  ensureDirectoryExists(): string {
    try {
      return mkdirSync(this.getNewDirectory(), { recursive: true });
    } catch (error) {
      throw new Error(error);
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

  static async readFile(filePath: string) {
    try {
      const file = await fs.readFile(filePath, 'utf8');
      const parsedFile = JSON.parse(file);
      return parsedFile;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateExistingFile(file: File): Promise<void> {
    try {
      const currentFile = await FileService.readFile(this.getNewFilePath());
      const updatedFile = this.fileFactory.update(currentFile, file);
      const stringifiedUpdatedFile = FileService.getPrettifiedJson(updatedFile);
      await fs.writeFile(this.getNewFilePath(), stringifiedUpdatedFile);
    } catch (error) {
      throw new Error(error);
    }
  }

  async createNewFile(file: File): Promise<void> {
    try {
      const stringifiedFile = FileService.getPrettifiedJson(file);
      await fs.writeFile(this.getNewFilePath(), stringifiedFile);
    } catch (error) {
      throw new Error(error);
    }
  }

  async saveFile(file: File): Promise<void> {
    this.ensureDirectoryExists();
    try {
      const fileExists = await FileService.fileExists(this.getNewFilePath());
      if (fileExists) {
        await this.updateExistingFile(file);
      } else {
        await this.createNewFile(file);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  static getPrettifiedJson<F>(file: F): string {
    try {
      return JSON.stringify(file, null, 2);
    } catch (error) {
      throw new Error(error);
    }
  }

  async readFiles(): Promise<File[]> {
    this.ensureDirectoryExists();

    const fileNames = await fs.readdir(this.getNewDirectory());
    const filePaths = fileNames.map((fileName) => path.join(...this.getPathChunks(), fileName));

    return new Promise((resolve, reject) => {
      const files: Array<File> = [];
      const promises = filePaths.map((filePath: string) => {
        return fs
          .readFile(filePath, 'utf8')
          .then((file) => {
            const parsedFile: File = JSON.parse(file);
            files.push(parsedFile);
            return files;
          })
          .catch((error) => {
            throw new Error(error);
          });
      });
      Promise.all(promises)
        .then(() => {
          resolve(files);
          return files;
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
