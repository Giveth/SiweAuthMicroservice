import { verify } from 'jsonwebtoken';
import { generateNonce } from 'siwe';
import { Route, Tags, Post } from 'tsoa';
import { AccessToken } from '../../entities/accessToken';
import { GivethService } from '../../entities/givethService';
import { AuthorizationResponse } from '../../types/requestResponses';
import { StandardError } from '../../types/StandardError';
import { errorMessagesEnum } from '../../utils/errorMessages';
import { logger } from '../../utils/logger';

@Route('/v1/authorization')
@Tags('Authorization')
export class AuthorizationController {
  @Post('/')
  public async authorize(jwt: string): Promise<boolean> {
    try {
      const verifiedJwt = verify(jwt, process.env.JWT_SECRET as string) as any;
      const givethService = await GivethService.createQueryBuilder()
        .where(`"serviceLabel" = :label`, {
          label: verifiedJwt.givethServiceLabel,
        })
        .getOne();
      const dbAccessToken = await AccessToken.createQueryBuilder()
        .where(`jwt = :jwt`, { jwt: jwt })
        .andWhere(`jti = :jti`, { jti: verifiedJwt.jti })
        .andWhere(`"givethServiceId" = :id`, { id: givethService?.id })
        .andWhere(`"isExpired" = false AND "isBlackListed" = false`)
        .getOne();

      if (!dbAccessToken)
        throw new StandardError(errorMessagesEnum.JWT_NOT_FOUND);

      if (dbAccessToken?.didExpire()) {
        dbAccessToken.isExpired = true;
        dbAccessToken.save();
        throw new StandardError(errorMessagesEnum.JWT_EXPIRED);
      }

      return true;
    } catch (e) {
      logger.error('authorizationController error', e);
      throw e;
    }
  }
}
