import { JwtPayload } from '../services/jwtService';

export type AuthenticationRequest = {
  signature: string;
  message: string;
  nonce: string;
};

export type AuthorizationRequest = {
  siwe: SiweFields;
  expiration: Date;
};

export type SiweFields = any;

export type AuthenticationResponse = {
  jwt: string;
  expiration: number;
};

export type AuthorizationResponse = {};

export type CreateDonationRequest = {
  /**
   * @example 10
   */
  amount: number;

  /**
   * @example "GIV"
   */
  currency: string;

  /**
   * @example false
   */
  anonymous: boolean;

  /**
   * @example 0.2403
   */
  priceUsd: number;

  /**
   * @example "0xEf191aeb45A0d6f393D4a592f94152836d5758f8"
   */
  fromWalletAddress: string;

  /**
   * @example "0x826976d7c600d45fb8287ca1d7c76fc8eb732030"
   */
  toWalletAddress: string;

  /**
   * @example 274
   */
  nonce?: number;

  /**
   * @example "0x9a474c4791e526e35941dd8dd146405f15860fa19aca4abb5e0a4225294c36e0"
   */
  txHash: string;

  /**
   * @example "gnosis"
   */
  network: 'ropsten' | 'mainnet' | 'gnosis';
};
export type CreateDonationResponse = {
  donationId: number;
};

export type GenerateAccessTokenRequest = {
  /**
   * @example ["donations:create"]
   */
  scopes: string[];
};

export type CreateAccessTokenResponse = {
  accessToken: string;
  lifeTime: number;
  payload: JwtPayload;
  intent: string;
};
