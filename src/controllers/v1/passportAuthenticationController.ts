import { SiweMessage } from 'siwe';
import { Route, Tags, Post, Body } from 'tsoa';
import { SiweNonce } from '../../entities/siweNonce';
import { findNonce } from '../../repositories/siweNonceRepository';
import { generateAccessToken } from '../../services/authenticationService';
import {
  AuthenticationResponse,
  PassportAuthenticationRequest,
} from '@/src/types/requestResponses';
import { StandardError } from '@/src/types/StandardError';
import { errorMessagesEnum } from '../../utils/errorMessages';
import { logger } from '../../utils/logger';
import axios, { AxiosResponse } from 'axios';
import { getPassportRequestHeaders } from '@/src/services/passport';
import { ethers } from 'ethers';

@Route('/v1/passportAuthentication')
@Tags('Passport Authentication')
export class PassportAuthenticationController {
  @Post()
  public async authenticate(
    @Body() body: PassportAuthenticationRequest,
  ): Promise<AuthenticationResponse> {
    const { message, nonce, signature } = body;

    let address: string;
    try {
      address = ethers.utils.verifyMessage(message, signature);
    } catch (e) {
      throw new StandardError(errorMessagesEnum.PASSPORT_INVALID_SIGNATURE);
    }
    logger.info('Logging address: ', address);

    let response: AxiosResponse;
    try {
      response = await axios.post(
        'https://api.scorer.gitcoin.co/registry/submit-passport',
        {
          address,
          scorer_id: process.env.GITCOIN_COMMUNITY_ID,
        },
        { headers: getPassportRequestHeaders() },
      );
    } catch (e) {
      logger.error('POST authenticate, passport authentication failed', e);
      throw new StandardError(errorMessagesEnum.PASSPORT_ERROR);
    }
    switch (response.status) {
      case 400:
        throw new StandardError(errorMessagesEnum.PASSPORT_BAD_REQUEST);
      case 401:
        throw new StandardError(errorMessagesEnum.PASSPORT_UNAUTHORIZED);
      case 404:
        throw new StandardError(errorMessagesEnum.PASSPORT_NOT_FOUND);
      case 200:
      default:
        break;
    }

    if (response.data.status !== 'PROCESSING') {
      logger.error(
        'POST authenticate, passport authentication failed',
        response.data,
      );
      throw new StandardError(errorMessagesEnum.PASSPORT_ERROR);
    }

    const token = await generateAccessToken({ address }, true);
    logger.info(
      `User with address ${token.publicAddress} logged in with passport`,
    );

    return {
      jwt: token.jwt,
      expiration: token.expirationDate.valueOf(),
      publicAddress: token.publicAddress,
    };
  }
}
