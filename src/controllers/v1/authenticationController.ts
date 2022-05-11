import moment from 'moment';
import { SiweMessage } from 'siwe';
import { Route, Tags, Post, Body } from 'tsoa';
import { AccessToken } from '../../entities/accessToken';
import { SiweNonce } from '../../entities/siweNonce';
import { findGivethServiceByLabel } from '../../repositories/givethServiceRepository';
import { findNonce } from '../../repositories/siweNonceRepository';
import { generateAccessToken } from '../../services/authenticationService';
import { generateJwt } from '../../services/jwtService';
import {
  AuthenticationRequest,
  AuthenticationResponse,
} from '../../types/requestResponses';
import { StandardError } from '../../types/StandardError';
import { errorMessagesEnum } from '../../utils/errorMessages';
import { logger } from '../../utils/logger';
import { generateRandomString } from '../../utils/utils';

@Route('/v1/authentication')
@Tags('Authentication')
export class AuthenticationController {
  @Post('/')
  public async authenticate(
    @Body() body: AuthenticationRequest,
  ): Promise<AuthenticationResponse> {
    try {
      const message = new SiweMessage(body.message);
      const fields = await message.validate(body.signature);

      const whitelistedNonce = await findNonce(fields.nonce);
      if (!whitelistedNonce)
        throw new StandardError(errorMessagesEnum.NONCE_INVALID);

      if (whitelistedNonce.isExpired()) {
        await SiweNonce.delete({ id: whitelistedNonce.id });
        throw new StandardError(errorMessagesEnum.NONCE_EXPIRED);
      }

      const token = await generateAccessToken(body.serviceLabel, fields);

      return {
        jwt: token.jwt,
        expiration: token.expirationDate.valueOf(),
        publicAddress: token.publicAddress,
      };
    } catch (e) {
      logger.error('authenticationController error', e);
      throw e;
    }
  }
}
