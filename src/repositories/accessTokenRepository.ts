import { AccessToken } from "../entities/accessToken";

export const findActiveTokenByValue = async (jwt: string):Promise<AccessToken | null> => {
  throw new Error('npt implemented'+ jwt)
}
