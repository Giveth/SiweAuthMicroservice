import { Application } from "../entities/application";

export const findApplicationByBasicAuthData = async (inputData: {
  username: string,
  secret: string
}) :Promise<Application>=>{
  throw new Error('Not implemented')
  // should check application is active or not
}
