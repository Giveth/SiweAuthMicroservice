import { AccessToken } from '../entities/accessToken';
import { Column, Index, ManyToOne, RelationId } from 'typeorm';
import { Application } from '../entities/application';

export const findActiveTokenByValue = async (
  jwt: string,
): Promise<AccessToken | null> => {
  return AccessToken.createQueryBuilder('access_token')
    .where(`jwt = :jwt`, {
      jwt,
    })
    .andWhere(`"isActive" is true`)
    .getOne();
};

export const createNewAccessToken = async (params: {
  jwt: string;
  scopes: string[];
  isActive: boolean;
  application: Application;
  expirationDate: number;
  jti: string;
}): Promise<AccessToken> => {
  return AccessToken.create({ ...params }).save();
};
