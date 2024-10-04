import path from 'node:path';
import {checkVersion} from './check';
import {writeFile} from './fs';

interface IData {
  license: string;
  privateKey: string;
  publicKey: string;
  projectFolder: string;
}

interface ICrack {
  (
    project: IData['projectFolder'],
    data: Omit<IData, 'projectFolder'>
  ): Promise<void>;
}

interface ICrackV4 {
  (
    project: IData['projectFolder'],
    data: Omit<IData, 'projectFolder'>
  ): Promise<void>;
}

interface ICrackV5 {
  (
    project: IData['projectFolder'],
    data: Omit<IData, 'projectFolder'>
  ): Promise<void>;
}

export const crackV4: ICrackV4 = async (project, {license, publicKey}) => {
  const strapiPublicKeyPath = path.join(
    project,
    'node_modules/@strapi/strapi/resources/key.pub'
  );
  const strapiLicensePath = path.join(project, 'license.txt');

  await writeFile(strapiPublicKeyPath, publicKey);
  await writeFile(strapiLicensePath, license, true);
};

export const crackV5: ICrackV5 = async (project, {license, publicKey}) => {
  const strapiPublicKeyPath = path.join(
    project,
    'node_modules/@strapi/core/resources/key.pub'
  );
  const strapiLicensePath = path.join(project, 'license.txt');

  await writeFile(strapiPublicKeyPath, publicKey);
  await writeFile(strapiLicensePath, license, true);
};

export const crack: ICrack = async (
  project,
  {license, privateKey, publicKey}
) => {
  const version = await checkVersion(project);
  if (version === 'v4') {
    return crackV4(project, {license, privateKey, publicKey});
  }
  return crackV5(project, {license, privateKey, publicKey});
};
