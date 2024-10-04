import path from 'node:path';
import {readFile} from './fs';

interface ICheckVersion {
  (folder: string): Promise<'v4' | 'v5'>;
}

export const checkVersion: ICheckVersion = async folder => {
  const packageJson = await path.join(
    folder,
    'node_modules',
    '@strapi',
    'strapi',
    'package.json'
  );
  const data = await readFile(packageJson);
  const {version} = JSON.parse(data) as {
    version: string;
  };

  const isV4 = version.startsWith('4');
  const isV5 = version.startsWith('5');

  if (isV4) return 'v4';
  if (isV5) return 'v5';
  throw new Error('Strapi version not found');
};
