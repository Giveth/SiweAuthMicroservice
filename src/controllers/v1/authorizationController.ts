import { verify } from 'jsonwebtoken';
import { Route, Tags, Post } from 'tsoa';
import { findAccessTokenByUniqueIdentifiers } from '../../repositories/accessTokenRepository';
import { AuthorizationResponse } from '../../types/requestResponses';
import { StandardError } from '../../types/StandardError';
import { errorMessagesEnum } from '../../utils/errorMessages';
import { logger } from '../../utils/logger';

@Route('/v1/authorization')
@Tags('Authorization')
export class AuthorizationController {
  @Post('/')
  public async authorize(jwt: string): Promise<AuthorizationResponse> {
    try {
      const verifiedJwt = verify(jwt, process.env.JWT_SECRET as string) as any;

      const dbAccessToken = await findAccessTokenByUniqueIdentifiers(
        jwt,
        verifiedJwt.jti,
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
