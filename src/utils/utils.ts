import { randomBytes } from 'crypto';

export const generateRandomString = (len: number): string => {
  return randomBytes(len).toString('hex');
};

export const generateRandomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const networkIds = {
  ropsten: 3,
  mainnet: 1,
  gnosis: 100,
};
