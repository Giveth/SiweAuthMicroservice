import { randomBytes } from 'crypto';

export const generateRandomString = (len: number): string => {
  return randomBytes(len).toString('hex');
};

export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const networkIds = {
  ropsten: 3,
  mainnet: 1,
  gnosis: 100,
};

export const findObjectByClosestTimestamp = (
  target: number,
  objects: any[],
) => {
  if (objects.length === 0) return null;

  let closestObj = objects[0];
  let closestTimestamp = closestObj.creationTimestamp;
  let smallestDifference = Math.abs(target - closestTimestamp);

  objects.forEach(obj => {
    const difference = Math.abs(target - obj.creationTimestamp);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestObj = obj;
      closestTimestamp = obj.creationTimestamp;
    }
  });

  return closestObj;
};
