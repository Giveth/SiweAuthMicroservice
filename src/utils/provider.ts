import { ethers } from 'ethers';

const INFURA_ID = process.env.INFURA_ID;

export const NETWORK_IDS = {
  MAIN_NET: 1,
  ROPSTEN: 3,
  SEPOLIA: 11155111,
  XDAI: 100,
  POLYGON: 137,
  OPTIMISTIC: 10,
  OPTIMISM_SEPOLIA: 11155420,
  BSC: 56,
  CELO: 42220,
  CELO_ALFAJORES: 44787,
  ETC: 61,
  MORDOR_ETC_TESTNET: 63,

  ARBITRUM_MAINNET: 42161,
  ARBITRUM_SEPOLIA: 421614,

  BASE_MAINNET: 8453,
  BASE_SEPOLIA: 84532,

  ZKEVM_MAINNET: 1101,
  ZKEVM_CARDONA: 2442,

  STELLAR_MAINNET: 1500,

  // https://docs.particle.network/developers/other-services/node-service/solana-api
  SOLANA_MAINNET: 101,
  SOLANA_TESTNET: 102,
  SOLANA_DEVNET: 103,

  // Cardano (Blockfrost uses projectId not numeric chain id, but we map one for consistency)
  CARDANO_MAINNET: 3000,
  CARDANO_PREPROD: 3001,
};

const NETWORK_NAMES = {
  BSC: 'bsc',
  XDAI: 'xdaichain',
  MAINNET: 'mainnet',
  ROPSTEN: 'ropsten',
  SEPOLIA: 'sepolia',
  POLYGON: 'polygon-mainnet',
  OPTIMISTIC: 'optimistic-mainnet',
  OPTIMISM_SEPOLIA: 'optimism-sepolia-testnet',
  CELO: 'Celo',
  CELO_ALFAJORES: 'Celo Alfajores',
  ETC: 'Ethereum Classic',
  MORDOR_ETC_TESTNET: 'Ethereum Classic Testnet',
  ARBITRUM_MAINNET: 'Arbitrum Mainnet',
  ARBITRUM_SEPOLIA: 'Arbitrum Sepolia',
  BASE_MAINNET: 'Base Mainnet',
  BASE_SEPOLIA: 'Base Sepolia',

  ZKEVM_CARDONA: 'ZKEVM Cardona',
  ZKEVM_MAINNET: 'ZKEVM Mainnet',

  STELLAR_MAINNET: 'Stellar Mainnet',

  CARDANO_MAINNET: 'Cardano Mainnet',
  CARDANO_PREPROD: 'Cardano Preprod',
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
    case NETWORK_IDS.SEPOLIA:
      url = 'https://safe-transaction-sepolia.safe.global/';
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
    case NETWORK_IDS.CELO_ALFAJORES:
      // If not supported by Safe, fall back to mainnet
      url = 'https://safe-transaction-mainnet.safe.global/';
      break;
    case NETWORK_IDS.OPTIMISTIC:
      url = 'https://safe-transaction-optimism.safe.global/';
      break;
    case NETWORK_IDS.OPTIMISM_SEPOLIA:
      url = 'https://safe-transaction-optimism-sepolia.safe.global/';
      break;
    case NETWORK_IDS.POLYGON:
      url = 'https://safe-transaction-polygon.safe.global/';
      break;
    case NETWORK_IDS.ARBITRUM_MAINNET:
      url = 'https://safe-transaction-arbitrum.safe.global/';
      break;
    case NETWORK_IDS.ARBITRUM_SEPOLIA:
      url = 'https://safe-transaction-arbitrum-sepolia.safe.global/';
      break;
    case NETWORK_IDS.BASE_MAINNET:
      url = 'https://safe-transaction-base.safe.global/';
      break;
    case NETWORK_IDS.BASE_SEPOLIA:
      url = 'https://safe-transaction-base-sepolia.safe.global/';
      break;
    case NETWORK_IDS.ZKEVM_MAINNET:
      // If not supported by Safe, fall back to mainnet
      url = 'https://safe-transaction-mainnet.safe.global/';
      break;
    case NETWORK_IDS.ZKEVM_CARDONA:
      // If not supported by Safe, fall back to mainnet
      url = 'https://safe-transaction-mainnet.safe.global/';
      break;
    case NETWORK_IDS.ETC:
    case NETWORK_IDS.MORDOR_ETC_TESTNET:
      // Not supported by Safe Transaction Service
      url = 'https://safe-transaction-mainnet.safe.global/';
      break;
    case NETWORK_IDS.STELLAR_MAINNET:
    case NETWORK_IDS.SOLANA_MAINNET:
    case NETWORK_IDS.SOLANA_TESTNET:
    case NETWORK_IDS.SOLANA_DEVNET:
    case NETWORK_IDS.CARDANO_MAINNET:
    case NETWORK_IDS.CARDANO_PREPROD:
      // Non-EVM networks are unsupported by Safe Transaction Service
      url = 'https://safe-transaction-mainnet.safe.global/';
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
    case NETWORK_IDS.MORDOR_ETC_TESTNET:
      url =
        (process.env.MORDOR_ETC_TESTNET as string) ||
        `https://rpc.mordor.etccooperative.org`;
      break;
    case NETWORK_IDS.ETC:
      url = process.env.ETC_NODE_HTTP_URL as string;
      break;
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

    case NETWORK_IDS.OPTIMISM_SEPOLIA:
      url = `https://optimism-sepolia.infura.io/v3/${INFURA_ID}`;
      break;

    case NETWORK_IDS.ARBITRUM_MAINNET:
      url =
        (process.env.ARBITRUM_MAINNET_NODE_HTTP_URL as string) ||
        `https://arbitrum-mainnet.infura.io/v3/${INFURA_ID}`;
      break;

    case NETWORK_IDS.ARBITRUM_SEPOLIA:
      url =
        (process.env.ARBITRUM_SEPOLIA_NODE_HTTP_URL as string) ||
        `https://arbitrum-sepolia.infura.io/v3/${INFURA_ID}`;
      break;

    case NETWORK_IDS.BASE_MAINNET:
      url =
        (process.env.BASE_MAINNET_NODE_HTTP_URL as string) ||
        `https://base-mainnet.infura.io/v3/${INFURA_ID}`;
      break;

    case NETWORK_IDS.BASE_SEPOLIA:
      url =
        (process.env.BASE_SEPOLIA_NODE_HTTP_URL as string) ||
        `https://base-sepolia.infura.io/v3/${INFURA_ID}`;
      break;

    // Infura doesn support Polygon ZKEVM
    case NETWORK_IDS.ZKEVM_MAINNET:
      url = process.env.ZKEVM_MAINNET_NODE_HTTP_URL as string;
      break;

    case NETWORK_IDS.ZKEVM_CARDONA:
      url = process.env.ZKEVM_CARDONA_NODE_HTTP_URL as string;
      break;

    case NETWORK_IDS.STELLAR_MAINNET:
      url = process.env.STELLAR_HORIZON_API_URL as string;
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
