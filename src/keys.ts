import {exec} from 'child_process';

interface ICreatePrivate {
  (): Promise<string>;
}

interface ICreatePublic {
  (privateKey: string): Promise<string>;
}

export const createPrivate: ICreatePrivate = async () => {
  const privateKey = await new Promise<string>((resolve, reject) => {
    exec('openssl genpkey -algorithm RSA', (error, stdout, stderr) => {
      if (error || stderr) return reject(error || stderr);
      const keyRegex =
        /-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/gm;
      const [key] = stdout.match(keyRegex) || [''];
      return resolve(key);
    });
  });
  return privateKey;
};

export const createPublic: ICreatePublic = async (privateKey: string) => {
  const publicKey = await new Promise<string>((resolve, reject) => {
    exec(
      `echo "${privateKey}" | openssl rsa -pubout`,
      (error, stdout, stderr) => {
        if (error || stderr?.trim() !== 'writing RSA key')
          return reject(error || stderr);
        return resolve(stdout);
      }
    );
  });

  return publicKey;
};
