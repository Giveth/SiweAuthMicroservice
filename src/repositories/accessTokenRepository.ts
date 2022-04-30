import { AccessToken } from '../entities/accessToken';

export const findActiveTokenByValue = async (
  jwt: string,
): Promise<AccessToken | null> => {
  return AccessToken.createQueryBuilder('access_token')
    .where(`value = :jwt`, {
      jwt,
    })
    .andWhere(`"isActive" is true`)
    .getOne();
};
