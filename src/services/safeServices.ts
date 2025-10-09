import SafeApiKit from '@safe-global/api-kit';
import { EthersAdapter } from '@safe-global/protocol-kit';
import axios from 'axios';
import { ethers, logger } from 'ethers';
import { getProvider, getSafeTransactionNetworkUrl } from '../utils/provider';
import { findObjectByClosestTimestamp } from '../utils/utils';

export const fetchSafeMessage = async (
  safeMessageHash: string,
  networkId: number,
) => {
  let safeMessage;
  try {
    const response = await axios.get(
      `https://safe-client.safe.global/v1/chains/${networkId}/messages/${safeMessageHash}`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    safeMessage = response.data;
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
    const response = await axios.get(
      `https://safe-client.safe.global/v1/chains/${networkId}/safes/${safeAddress}/messages`,
      {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
        },
      },
    );
    logger.info('fetchSafeMessageByTimestamp() response', { response });
    safeMessage = findObjectByClosestTimestamp(
      safeMessageTimestamp,
      response.data.results,
    );
  } catch (e) {
    console.error('fetchSafeMessageByTimestamp() error', e);
  }

  return safeMessage;
};

export const getSafeApiKit = async (network: number) => {
  const provider = getProvider(network);
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: provider,
  });

  return new SafeApiKit({
    txServiceUrl: getSafeTransactionNetworkUrl(network),
    ethAdapter,
  });
};
