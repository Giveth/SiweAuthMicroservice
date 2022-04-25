import { NextFunction, Request, Response } from "express";
import { decodeBasicAuthentication } from "../utils/authorizationUtils";
import { findApplicationByBasicAuthData } from "../services/applicationService";

export const authenticateThirdPartyBasicAuth =async (req: Request, res: Response, next: NextFunction) =>{
  const authorization = req.headers.authorization as string
  if (authorization){
    throw new Error()
  }
  const {username, secret} = decodeBasicAuthentication(authorization)
  const application =await findApplicationByBasicAuthData({
    username,
    secret
  })
  res.locals.application = application
  next()
}
