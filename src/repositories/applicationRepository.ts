import { Application } from '../entities/application';

export const findApplicationById = async (
  applicationId: number,
): Promise<Application | null> => {
  return Application.createQueryBuilder('application')
    .where(`id = :id`, {
      id: applicationId,
    })
    .getOne();
};

export const findApplicationByIdJoinOrganization = async (
  applicationId: number,
): Promise<Application | null> => {
  return Application.createQueryBuilder('application')
    .leftJoinAndSelect('application.organization', 'organization')
    .where(`application.id = :id`, {
      id: applicationId,
    })
    .getOne();
};
