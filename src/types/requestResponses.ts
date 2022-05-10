import { JwtPayload } from '../services/jwtService';

export type AuthenticationRequest = {
  signature: string;
  message: string;
  nonce: string;
  serviceLabel: string;
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

export type CreateAccessTokenResponse = {
  accessToken: string;
  lifeTime: number;
  payload: JwtPayload;
  intent: string;
};
