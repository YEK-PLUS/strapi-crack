import path from 'node:path';
import {readFile} from './fs';

interface ICheckVersion {
  (folder: string): Promise<'v4' | 'v5'>;
}

export const checkVersion: ICheckVersion = async folder => {
  const packageJson = await path.join(folder, 'package.json');
  const data = await readFile(packageJson);
  const {dependencies} = JSON.parse(data) as {
    dependencies: Record<string, string>;
  };
  const strapi = dependencies['@strapi/strapi'];

  const isV4 = strapi ? strapi.startsWith('4') : false;
  const isV5 = strapi ? strapi.startsWith('5') : false;

  if (isV4) return 'v4';
  if (isV5) return 'v5';
  throw new Error('Strapi version not found');
};
