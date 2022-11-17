import { SiweMessage } from 'siwe';
import { Route, Tags, Post, Body } from 'tsoa';
import { SiweNonce } from '../../entities/siweNonce';
import { findNonce } from '../../repositories/siweNonceRepository';
import { generateAccessToken } from '../../services/authenticationService';
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
  @Post()
  public async authenticate(
    @Body() body: AuthenticationRequest,
  ): Promise<AuthenticationResponse> {
    try {
      const message = new SiweMessage(body.message);
      const fields = await message.validate(body.signature);

      const whitelistedNonce = await findNonce(fields.nonce);
      if (!whitelistedNonce || fields.nonce !== body.nonce)
        throw new StandardError(errorMessagesEnum.NONCE_INVALID);

      if (whitelistedNonce.isExpired()) {
        logger.info('POST authenticate, whitelistedNonce is expired', whitelistedNonce)
        await SiweNonce.delete({ id: whitelistedNonce.id });
        throw new StandardError(errorMessagesEnum.NONCE_EXPIRED);
      }
      const token = await generateAccessToken(fields);
      logger.info(`User with address ${token.publicAddress} logged in`);

      // clean up to prevent reuse
      await SiweNonce.delete({ id: whitelistedNonce.id });
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
