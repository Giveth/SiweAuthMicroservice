import { Admin } from '../entities/admin';

export const findAdminByEmail = async (
  email: string,
): Promise<Admin | null> => {
  return Admin.createQueryBuilder()
    .where(`email = :email`, { email })
    .getOne();
};
