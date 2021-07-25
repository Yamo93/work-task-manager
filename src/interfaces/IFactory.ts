export interface IFactory<File> {
  folderName: string;
  create: (file: File) => File;
  update: (oldFile: File, newFile: File) => File;
}
