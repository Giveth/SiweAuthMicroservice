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

  const dateLabelObjects = objects.filter(item => item.type !== 'DATE_LABEL');

  let closestObj = dateLabelObjects[0];
  let closestTimestamp = closestObj.creationTimestamp;
  let smallestDifference = Math.abs(target - closestTimestamp);

  dateLabelObjects.forEach(obj => {
    const difference = Math.abs(target - obj.creationTimestamp);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestObj = obj;
      closestTimestamp = obj.creationTimestamp;
    }
  });

  return closestObj;
};
