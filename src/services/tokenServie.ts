import { Application } from "../entities/application";
import { AccessToken } from "../entities/accessToken";

export const generateJwtToken = async (
  params: {
  scopes: string[],
    application: Application
}) :Promise<AccessToken>  =>{
    throw new Error('not implemented'+ JSON.stringify(params))
}
