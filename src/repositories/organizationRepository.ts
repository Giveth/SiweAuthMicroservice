import { Organization } from '../entities/organization';
import { AccessToken } from '../entities/accessToken';

export const findOrganizationById = (
  id: number,
): Promise<Organization | null> => {
  return Organization.createQueryBuilder('organization')
    .where(`id = :id`, {
      id,
    })
    .getOne();
};
