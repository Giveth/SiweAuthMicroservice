import SafeApiKit from '@safe-global/api-kit';
import { logger } from '../utils/logger';
import { findObjectByClosestTimestamp } from '../utils/utils';

export const fetchSafeMessage = async (
  safeMessageHash: string,
  networkId: number,
) => {
  let safeMessage;
  try {
    const apiKit = await getSafeApiKit(networkId);
    safeMessage = await apiKit.getMessage(safeMessageHash);
  } catch (e) {
    console.error('fetchSafeMessage() error', e);
  }

  return safeMessage;
};

export const fetchSafeMessageByTimestamp = async (
  safeAddress: string,
  safeMessageTimestamp: number,
  networkId: number,
) => {
  let safeMessage;
  logger.info('fetchSafeMessageByTimestamp() info:', {
    safeAddress,
    safeMessageTimestamp,
    networkId,
    date: new Date().toISOString(),
  });
  try {
    const apiKit = await getSafeApiKit(networkId);
    const response = await apiKit.getMessages(safeAddress);
    logger.info('fetchSafeMessageByTimestamp() response', {
      results: response.results,
    });
    safeMessage = findObjectByClosestTimestamp(
      safeMessageTimestamp,
      response.results,
    );
  } catch (e) {
    console.error('fetchSafeMessageByTimestamp() error', e);
  }

  return safeMessage;
};

export const getSafeApiKit = async (network: number) => {
  return new SafeApiKit({
    // Per Safe docs, chainId must be a bigint literal; convert network id accordingly
    chainId: BigInt(network),
    apiKey: process.env.SAFE_API_KEY,
  });
};
