import { randomBytes } from 'crypto';

export const generateRandomString = (len: number): string => {
  return randomBytes(len).toString('hex');
};
