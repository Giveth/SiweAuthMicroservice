import { JwtPayload } from '../services/jwtService';

export type AuthenticationRequest = {
  signature: string;
  message: string;
  nonce: string;
};

export type AuthorizationRequest = {
  siwe: any;
  expiration: Date;
};

export type AuthenticationResponse = {
  jwt: string;
  expiration: number;
  publicAddress: string;
};

export type AuthorizationResponse = AuthenticationResponse;

export type CreateAccessTokenResponse = {
  accessToken: string;
  lifeTime: number;
  payload: JwtPayload;
  intent: string;
};
