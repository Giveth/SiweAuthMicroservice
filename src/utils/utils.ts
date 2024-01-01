import { randomBytes } from 'crypto';

const MULTISIG_MESSAGE = 'Login into Giveth services';

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

function isValidSafeLoginMessage(safeMessage: any): boolean {
  return safeMessage.message.includes(MULTISIG_MESSAGE);
}

export const findObjectByClosestTimestamp = (
  target: number,
  objects: any[],
) => {
  if (objects.length === 0) return null;

  const safeMessages = objects.filter(item => item.type !== 'DATE_LABEL');
  const dateLabelObjects = safeMessages.filter(obj =>
    isValidSafeLoginMessage(obj),
  );

  let closestObj = dateLabelObjects[0];
  let closestTimestamp = closestObj.creationTimestamp;
  let smallestDifference = Math.abs(target - closestTimestamp);
  const tenMinutesInMilliseconds = 10 * 60 * 1000;
  const currentTime = new Date().getTime();

  dateLabelObjects.forEach(obj => {
    const difference = Math.abs(target - obj.creationTimestamp);
    if (
      difference <= tenMinutesInMilliseconds &&
      difference < smallestDifference
    ) {
      smallestDifference = difference;
      closestObj = obj;
      closestTimestamp = obj.creationTimestamp;
    }
  });

  if (currentTime - closestTimestamp > tenMinutesInMilliseconds) {
    return null;
  }

  return closestObj;
};
