import { Application } from "../entities/application";

export const findApplicationByBasicAuthData = async ( params: {
  username: string,
  secret: string
}) :Promise<Application>=>{
  throw new Error('Not implemented'+ JSON.stringify(params))
  // should check application is active or not
}
