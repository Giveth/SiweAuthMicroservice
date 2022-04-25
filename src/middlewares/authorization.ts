import { NextFunction, Request, Response } from "express";

export const getAccessScopeMiddleware = ( params :{
                                              scope:string}) =>{
  const {scope} = params;

  return (_req:Request, res: Response, next: NextFunction)=>{
    const accessToken = res.locals.accessToken
    if (accessToken.scopes.includes(scope)){
      return next()
    }
    throw new Error('Doesnt have access to scope 403')

  }

}
