import { AccessToken } from './accessToken';
import { Admin } from './admin';
import { BlacklistedAddress } from './blacklistedAddress';
import { MultisigSession } from './multisigSession';
import { SiweNonce } from './siweNonce';

export const entities = [
  SiweNonce,
  AccessToken,
  Admin,
  MultisigSession,
  BlacklistedAddress,
];
