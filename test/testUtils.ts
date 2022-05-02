import { assert } from 'chai';
import { scopeLabels } from '../src/services/scopeService';
import { findApplicationById } from '../src/repositories/applicationRepository';
import { generateAccessToken } from '../src/services/tokenServie';
import { Application } from 'express';

// eslint:disable-next-line
export const serverUrl = 'http://localhost:3041';
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

export const SEED_DATA = {
  firstOrganization: {
    // This item will be added by migration
    id: 1,
    name: 'test name',
    website: 'test website',
    label: 'test label',
    isVerified: true,
    isActive: true,
  },
  firstApplication: {
    // This item will be added by migration
    id: 1,
    organizationId: 1,
    secret: 'test-secret',
    label: 'test-application',
    name: 'test application',
    logo: 'https://giveth.mypinata.cloud/ipfs/QmQ9sfdevs9vS7czBXBfDaRRPhU8a6T5gXxF3NDGSnQe1c',
    scopes: [scopeLabels.CREATE_DONATION],
    isActive: true,
  },
};

export const createAccessTokenForTest = async (params: {
  scopes: string[];
  applicationId: number;
}): Promise<string> => {
  const application = await findApplicationById(params.applicationId);
  if (!application) {
    throw new Error('Application not found');
  }
  const { accessToken } = await generateAccessToken({
    application,
    scopes: params.scopes,
  });
  return accessToken;
};
