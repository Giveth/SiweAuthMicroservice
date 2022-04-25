import { logger } from "./logger";

export const decodeBasicAuthentication = (basicAuthentication :string) :{
  username:string,
  secret:string
} => {
  try {
    const decodedStr = new Buffer(basicAuthentication.split(" ")[1], "base64").toString();
    return {
      username: decodedStr.split(":")[0],
      secret: decodedStr.split(":")[1]
    };
  } catch (e) {
    logger.error('decodeBasicAuthentication() error', e)
    throw e
  }

}
