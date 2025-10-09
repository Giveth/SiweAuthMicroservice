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
          accept: 'application/json',
          'accept-language': 'en-US,en;q=0.9,fa;q=0.8',
          'cache-control': 'no-cache',
          dnt: '1',
          pragma: 'no-cache',
          priority: 'u=1, i',
          referer: 'https://safe-client.safe.global/api',
          'sec-ch-ua':
            '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'sec-gpc': '1',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
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
