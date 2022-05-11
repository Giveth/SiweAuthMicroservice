import { verify } from 'jsonwebtoken';
import { generateNonce } from 'siwe';
import { Route, Tags, Post } from 'tsoa';
import { AccessToken } from '../../entities/accessToken';
import { GivethService } from '../../entities/givethService';
import { findAccessTokenByUniqueIdentifiers } from '../../repositories/accessTokenRepository';
import { findGivethServiceByLabel } from '../../repositories/givethServiceRepository';
import { AuthorizationResponse } from '../../types/requestResponses';
import { StandardError } from '../../types/StandardError';
import { errorMessagesEnum } from '../../utils/errorMessages';
import { logger } from '../../utils/logger';

@Route('/v1/authorization')
@Tags('Authorization')
export class AuthorizationController {
  @Post('/')
  public async authorize(
    jwt: string,
    serviceLabel: string,
  ): Promise<AuthorizationResponse> {
    try {
      const givethService = await findGivethServiceByLabel(serviceLabel);
      if (!givethService)
        throw new StandardError(errorMessagesEnum.SERVICE_NOT_IMPLEMENTED);

      const verifiedJwt = verify(
        jwt,
        givethService.decryptedJwtSecret(),
      ) as any;

      const dbAccessToken = await findAccessTokenByUniqueIdentifiers(
        jwt,
        verifiedJwt.jti,
        givethService,
      );

      if (!dbAccessToken)
        throw new StandardError(errorMessagesEnum.JWT_NOT_FOUND);

      return {
        jwt: dbAccessToken.jwt,
        expiration: dbAccessToken.expirationDate.valueOf(),
        publicAddress: dbAccessToken.publicAddress,
      };
    } catch (e) {
      logger.error('authorizationController error', e);
      throw e;
    }
  }
}
