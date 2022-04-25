import { Application } from "../entities/application";
import { AccessToken } from "../entities/accessToken";

export const generateJwtToken = async (
  inputData: {
  scopes: string[],
    application: Application
}) :Promise<AccessToken>  =>{
    throw new Error('not implemented')
}
