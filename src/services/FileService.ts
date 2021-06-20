import fs, { mkdir } from 'fs';
import moment from 'moment';
import path from 'path';
import { IWorkLog } from '../models/models';

export default class FileService {
  static saveWorkLog(workLog: IWorkLog): void {
    const currentYear = moment().year();
    const currentWeek = moment().isoWeek();
    const currentDate = moment().format('YYMMDD');
    const pathChunks = [
      __dirname,
      '..',
      'worklogs',
      currentYear.toString(),
      currentWeek.toString(),
    ];
    const newDirectory = path.join(...pathChunks);
    const newFilePath = path.join(...pathChunks, `${currentDate}.json`);
    const stringifiedWorkLog = JSON.stringify(workLog, null, 2);
    mkdir(newDirectory, { recursive: true }, (err) => {
      if (err) throw err;

      fs.writeFileSync(newFilePath, stringifiedWorkLog);
    });
  }
}
