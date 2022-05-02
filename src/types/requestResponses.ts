import { JwtPayload } from '../services/jwtService';

export type CreateDonationRequest = {
  amount: number;
  currency: string;
  priceUsd: number;
  fromWalletAddress: string;
  toWalletAddress: string;
  nonce?: number;
  txHash: string;
  network: 'ropsten' | 'mainnet' | 'gnosis';
};
export type CreateDonationResponse = {
  donationId: number;
};

export type CreateAccessTokenResponse = {
  accessToken: string;
  lifeTime: number;
  payload: JwtPayload;
  tokenType: string;
};
