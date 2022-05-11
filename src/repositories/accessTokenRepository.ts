import { AccessToken } from '../entities/accessToken';
import { GivethService } from '../entities/givethService';

export const findAccessTokenByUniqueIdentifiers = async (
  jwt: string,
  jti: string,
  givethService: GivethService,
): Promise<AccessToken | null> => {
  return AccessToken.createQueryBuilder()
    .where(`jwt = :jwt`, { jwt: jwt })
    .andWhere(`jti = :jti`, { jti: jti })
    .andWhere(`"givethServiceId" = :id`, { id: givethService.id })
    .andWhere(`"isExpired" = false AND "isBlackListed" = false`)
    .getOne();
};
