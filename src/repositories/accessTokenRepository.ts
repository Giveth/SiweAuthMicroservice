import { AccessToken } from '../entities/accessToken';

export const findAccessTokenByUniqueIdentifiers = async (
  jwt: string,
  jti: string,
): Promise<AccessToken | null> => {
  return AccessToken.createQueryBuilder()
    .where(`jwt = :jwt`, { jwt: jwt })
    .andWhere(`jti = :jti`, { jti: jti })
    .andWhere(`"isExpired" = false AND "isBlackListed" = false`)
    .getOne();
};
