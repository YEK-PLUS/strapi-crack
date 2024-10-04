import {promises} from 'node:fs';

interface IIsExists {
  (file: string): Promise<boolean>;
}

interface IWriteFile {
  (file: string, data: string, isNew?: boolean): Promise<void>;
}

interface IReadFile {
  (file: string): Promise<string>;
}

export const writeFile: IWriteFile = async (file, data, isNew = false) => {
  if ((await isExists(file)) && !isNew) {
    await promises.writeFile(file, data);
  } else if (!isNew) {
    throw new Error(`File ${file} already exists`);
  } else {
    await promises.writeFile(file, data);
  }
};

export const readFile: IReadFile = async file => {
  return await promises.readFile(file, 'utf-8');
};

export const isExists: IIsExists = async file => {
  try {
    await promises.access(file);
    return true;
  } catch {
    return false;
  }
};
