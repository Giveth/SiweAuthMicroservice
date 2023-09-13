import { ethers } from 'ethers';

const INFURA_ID = process.env.INFURA_ID;

export const NETWORK_IDS = {
  MAIN_NET: 1,
  ROPSTEN: 3,
  GOERLI: 5,
  XDAI: 100,
  POLYGON: 137,
  OPTIMISTIC: 10,
  OPTIMISM_GOERLI: 420,
  BSC: 56,
  CELO: 42220,
  CELO_ALFAJORES: 44787,
};

const NETWORK_NAMES = {
  BSC: 'bsc',
  XDAI: 'xdaichain',
  MAINNET: 'mainnet',
  ROPSTEN: 'ropsten',
  GOERLI: 'goerli',
  POLYGON: 'polygon-mainnet',
  OPTIMISTIC: 'optimistic-mainnet',
  OPTIMISM_GOERLI: 'optimism-goerli-testnet',
  CELO: 'Celo',
  CELO_ALFAJORES: 'Celo Alfajores',
};

export const getOriginHeader = () => {
  const SERVICE_NAME = process.env.SERVICE_NAME;
  return 'impact-graph-' + SERVICE_NAME || 'unnamed';
};

// https://docs.safe.global/safe-core-api/available-services
export function getSafeTransactionNetworkUrl(network: number) {
  let url;
  switch (network) {
    case NETWORK_IDS.MAIN_NET:
      url = 'https://safe-transaction-mainnet.safe.global/';
      break;
    case NETWORK_IDS.XDAI:
      url = 'https://safe-transaction-gnosis-chain.safe.global/';
      break;
    case NETWORK_IDS.BSC:
      url = 'https://safe-transaction-bsc.safe.global/';
      break;
    case NETWORK_IDS.CELO:
      url = 'https://safe-transaction-celo.safe.global/';
      break;
    case NETWORK_IDS.OPTIMISTIC:
      url = 'https://safe-transaction-optimism.safe.global/';
      break;
    case NETWORK_IDS.GOERLI:
      url = 'https://safe-transaction-goerli.safe.global/';
      break;
    case NETWORK_IDS.POLYGON:
      url = 'https://safe-transaction-polygon.safe.global/';
      break;
    default:
      return 'https://safe-transaction-mainnet.safe.global/';
  }
  return url;
}

export function getProvider(networkId: number) {
  let url;
  let options;
  switch (networkId) {
    case NETWORK_IDS.XDAI:
      url = process.env.XDAI_NODE_HTTP_URL as string;
      break;

    case NETWORK_IDS.BSC:
      // 'https://bsc-dataseed.binance.org/'
      url = process.env.BSC_NODE_HTTP_URL as string;
      options = { name: NETWORK_NAMES.BSC, chainId: NETWORK_IDS.BSC };
      break;

    case NETWORK_IDS.CELO:
      url =
        (process.env.CELO_NODE_HTTP_URL as string) ||
        `https://celo-mainnet.infura.io/v3/${INFURA_ID}`;
      break;

    case NETWORK_IDS.CELO_ALFAJORES:
      url =
        (process.env.CELO_ALFAJORES_NODE_HTTP_URL as string) ||
        `https://celo-alfajores.infura.io/v3/${INFURA_ID}`;
      break;

    case NETWORK_IDS.OPTIMISM_GOERLI:
      url = `https://optimism-goerli.infura.io/v3/${INFURA_ID}`;
      break;

    default: {
      // Use infura
      const connectionInfo = ethers.providers.InfuraProvider.getUrl(
        ethers.providers.getNetwork(networkId),
        { projectId: INFURA_ID },
      );
      connectionInfo.headers = {
        ...connectionInfo.headers,
        Origin: getOriginHeader(),
      };
      return new ethers.providers.JsonRpcProvider(connectionInfo);
    }
  }

  return new ethers.providers.JsonRpcProvider(
    {
      url,
      headers: {
        Origin: getOriginHeader(),
      },
    },
    options,
  );
}
