import { sign } from 'jsonwebtoken';

export type JwtPayload = {
  applicationId: number;
  scopes: string[];
  applicationLabel: string;
  jti: string;
}

export const generateJwt = (params: {
  lifeTimeSeconds: number;
  payload: JwtPayload;
}): {
  jwt: string;
} => {
  const jwt = sign(params.payload, process.env.JWT_SECRET as string, {
    expiresIn: `${params.lifeTimeSeconds}s`,
  });
  return {
    jwt,
  };
};
