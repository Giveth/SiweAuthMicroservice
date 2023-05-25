import { assert } from 'chai';
import { Application } from 'express';

// eslint:disable-next-line
export const serverUrl = 'http://localhost:3089';
// eslint:disable-next-line
export const assertThrowsAsync = async (fn: any, errorMessage?: string) => {
  let f = () => {
    // empty function
  };
  try {
    await fn();
  } catch (e) {
    f = () => {
      throw e;
    };
  } finally {
    if (errorMessage) {
      assert.throw(f, errorMessage);
    } else {
      assert.throw(f);
    }
  }
};

// eslint:disable-next-line
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// eslint:disable-next-line
export const assertNotThrowsAsync = async (fn: any) => {
  let f = () => {
    // empty function
  };
  try {
    await fn();
  } catch (e) {
    f = () => {
      throw e;
    };
  } finally {
    assert.doesNotThrow(f);
  }
};

// eslint:disable-next-line
export function generateRandomEthereumAddress(): string {
  return `0x${generateHexNumber(40)}`;
}

// eslint:disable-next-line
export function generateRandomTxHash(): string {
  return `0x${generateHexNumber(64)}`;
}

function generateHexNumber(len: number) {
  const hex = '0123456789abcdef';
  let output = '';
  /* eslint-disable no-plusplus */
  for (let i = 0; i < len; i++) {
    output += hex.charAt(Math.floor(Math.random() * hex.length));
  }
  return output;
}

export const SEED_DATA = {};
