import { getProvider, getSafeTransactionNetworkUrl } from '../utils/provider';
import { ethers } from 'ethers';
import SafeApiKit from '@safe-global/api-kit';
import { EthersAdapter } from '@safe-global/protocol-kit';
import { findObjectByClosestTimestamp } from '../utils/utils';
import axios from 'axios';

export const fetchSafeMessage = async (
  safeMessageHash: string,
  networkId: number,
) => {
  let safeMessage;
  const chainUrl = getSafeTransactionNetworkUrl(networkId);

  try {
    const response = await axios.get(
      `${chainUrl}/v1/messages/${safeMessageHash}/`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    safeMessage = response.data;
  } catch (e) {
    console.error(e);
  }

  return safeMessage;
};

export const fetchSafeMessageByTimestamp = async (
  safeAddress: string,
  safeMessageTimestamp: number,
  networkId: number,
) => {
  let safeMessage;
  try {
    const response = await axios.get(
      `https://safe-client.safe.global/v1/chains/${networkId}/safes/${safeAddress}/messages`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    safeMessage = findObjectByClosestTimestamp(
      safeMessageTimestamp,
      response.data.results,
    );
  } catch (e) {
    console.error(e);
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
