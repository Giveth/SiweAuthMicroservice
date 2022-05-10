import { SiweMessage } from 'siwe';
import { Route, Tags, Post, Body } from 'tsoa';
import { AccessToken } from '../../entities/accessToken';
import { SiweNonce } from '../../entities/siweNonce';
import { findNonce } from '../../repositories/siweNonceRepository';
import { generateJwt } from '../../services/jwtService';
import {
  AuthenticationRequest,
  AuthenticationResponse,
} from '../../types/requestResponses';
import { StandardError } from '../../types/StandardError';
import { errorMessagesEnum } from '../../utils/errorMessages';
import { logger } from '../../utils/logger';

@Route('/v1/authentication')
@Tags('Authentication')
export class AuthenticationController {
  @Post('/')
  public async authenticate(
    @Body() body: AuthenticationRequest,
  ): Promise<AuthenticationResponse> {
    try {
      let message = new SiweMessage(body.message);
      const fields = await message.validate(body.signature);
      const whitelistedNonce = await findNonce(fields.nonce);

      if (!whitelistedNonce)
        throw new StandardError(errorMessagesEnum.NONCE_INVALID);
      if (whitelistedNonce.isExpired()) {
        // get rid of expired nonces
        await SiweNonce.delete({ id: whitelistedNonce.id });
        throw new StandardError(errorMessagesEnum.NONCE_EXPIRED);
      }

      const accessToken = AccessToken.create({});
      const jwt = generateJwt({
        jti: accessToken.jti,
        publicAddress: fields.address,
        expirationDate: accessToken.expirationDate,
      });

      return {
        jwt: jwt,
        expiration: accessToken.expirationDate.valueOf(),
      };
    } catch (e) {
      logger.error('authenticationController error', e);
      throw e;
    }
  }
}
