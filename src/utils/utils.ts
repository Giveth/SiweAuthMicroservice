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
  if (!objects || objects.length === 0) return null;

  const candidateObjects = objects
    .map(obj => {
      const rawTimestamp =
        obj?.creationTimestamp ??
        obj?.timestamp ??
        obj?.createdAt ??
        obj?.created ??
        obj?.submissionDate ??
        obj?.date;

      let normalizedTimestamp: number | undefined = undefined;
      if (typeof rawTimestamp === 'string') {
        const parsed = Number(rawTimestamp);
        normalizedTimestamp = Number.isNaN(parsed) ? undefined : parsed;
      } else if (typeof rawTimestamp === 'number') {
        normalizedTimestamp = rawTimestamp;
      }

      if (typeof normalizedTimestamp === 'number') {
        if (normalizedTimestamp < 1e12) {
          normalizedTimestamp = normalizedTimestamp * 1000;
        }
      }

      return { obj, ts: normalizedTimestamp };
    })
    .filter(item => typeof item.ts === 'number' && !Number.isNaN(item.ts));

  if (candidateObjects.length === 0) return null;

  let closest = candidateObjects[0];
  let smallestDifference = Math.abs(target - (closest.ts as number));

  for (let i = 1; i < candidateObjects.length; i++) {
    const diff = Math.abs(target - (candidateObjects[i].ts as number));
    if (diff < smallestDifference) {
      smallestDifference = diff;
      closest = candidateObjects[i];
    }
  }

  const acceptableWindowMs = 15 * 60 * 1000;
  if (smallestDifference > acceptableWindowMs) {
    return null;
  }

  return closest.obj;
};
