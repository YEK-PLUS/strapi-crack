#!/usr/bin/env node
import yargs from 'yargs';
import {crack} from './crack';
import {createPrivate, createPublic} from './keys';
import {createLicense} from './license';

const argv = yargs
  .usage('Usage: $0 --dir [path]')
  .locale('en')
  .option('dir', {
    alias: 'd',
    describe: 'Project directory',
    type: 'string',
    demandOption: false,
  })
  .parseSync();

interface IMain {
  (projectFolder: string): Promise<void>;
}

const main: IMain = async projectFolder => {
  const privateKey = await createPrivate();
  const publicKey = await createPublic(privateKey);
  const license = await createLicense(privateKey);

  crack(projectFolder, {
    license,
    privateKey,
    publicKey,
  });
};

const projectFolder = argv.dir || process.cwd();

main(projectFolder);
