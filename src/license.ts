import {createSign} from 'node:crypto';

interface ICreateLicense {
  (privateKey: string): Promise<string>;
}

export const strapiLicense = {
  expireAt: '2099-12-31',
  type: 'gold',
};

export const createLicense: ICreateLicense = async privateKey => {
  const sign = createSign('RSA-SHA256');
  sign.write(JSON.stringify(strapiLicense));
  sign.end();

  const signature64 = sign.sign(privateKey).toString('base64');
  const data64 = Buffer.from(JSON.stringify(strapiLicense)).toString('base64');

  const license = Buffer.from(`${signature64}\n${data64}`).toString('base64');
  return license;
};
