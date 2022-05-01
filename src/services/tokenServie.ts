import { Application } from '../entities/application';
import { AccessToken } from '../entities/accessToken';
import { errorMessagesEnum } from '../utils/errorMessages';
import { generateJwt, JwtPayload } from './jwtService';
import { createNewAccessToken } from '../repositories/accessTokenRepository';
import { generateRandomString } from '../utils/utils';
import { CreateAccessTokenResponse } from '../types/requestResponses';

export const generateAccessToken = async (params: {
  scopes: string[];
  application: Application;
}): Promise<CreateAccessTokenResponse> => {
  const { scopes, application } = params;
  //Should check if scope is in db or not
  for (const scope of scopes) {
    if (!application.scopes.includes(scope)) {
      const error = errorMessagesEnum.YOU_DONT_HAVE_ACCESS_TO_THIS_SCOPE;
      error.message += `: ${scope}`;
      throw error;
    }
  }

  const jti = `${
    application.label
  }-${new Date().getTime()}-${generateRandomString(5)}`;
  const payload = {
    applicationId: application.id,
    scopes,
    applicationLabel: application.label,
    jti,
  };
  const lifeTimeSeconds =
    Number(process.env.ACCESS_TOKEN_LIFETIME_HOURS) * 3600;
  const { jwt } = generateJwt({
    lifeTimeSeconds,
    payload,
  });

  await createNewAccessToken({
    scopes,
    application,
    jwt,
    jti,
    isActive: true,
  });
  return {
    accessToken: jwt,
    lifeTime: lifeTimeSeconds,
    payload,
    tokenType: 'Bearer',
  };
};
