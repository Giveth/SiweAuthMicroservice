import { Application } from '../entities/application';

export const findApplicationByBasicAuthData = async (params: {
  username: string;
  secret: string;
}): Promise<Application | null> => {
  return Application.findOne({
    where: {},
  });
};
