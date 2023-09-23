import { getProvider, getSafeTransactionNetworkUrl } from '../utils/provider';
import { ethers } from 'ethers';
import SafeApiKit from '@safe-global/api-kit';
import { EthersAdapter } from '@safe-global/protocol-kit';
import { findObjectByClosestTimestamp } from '../utils/utils';

export const fetchSafeMessage = async (
  safeMessageHash: string,
  networkId: number,
) => {
  let safeMessage;
  const chainUrl = getSafeTransactionNetworkUrl(networkId);

  try {
    safeMessage = await fetch(`${chainUrl}/v1/messages/${safeMessageHash}/`, {
      headers: { 'Content-Type': 'application/json' },
    }).then(res => {
      if (!res.ok) {
        return Promise.reject('Invalid response when fetching SafeMessage');
      }
      return res.json();
    });
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
    const safeMessages = await fetch(
      `https://safe-client.safe.global/v1/chains/${networkId}/safes/${safeAddress}/messages`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    ).then(res => {
      if (!res.ok) {
        return Promise.reject('Invalid response when fetching SafeMessage');
      }
      return res.json();
    });
    safeMessage = findObjectByClosestTimestamp(
      safeMessageTimestamp,
      safeMessages.results,
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
