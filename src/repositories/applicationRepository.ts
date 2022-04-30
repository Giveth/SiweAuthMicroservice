import { Application } from '../entities/application';

export const findApplicationById = async (
  applicationId: number,
): Promise<Application> => {
  throw new Error('not implemented' + applicationId);
};
