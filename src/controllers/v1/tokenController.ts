import { Route, Tags, Post, Body, Security, Inject } from 'tsoa';
import { AccessToken } from '../../entities/accessToken';
import { Application } from '../../entities/application';
import { generateAccessToken } from '../../services/tokenServie';
import { logger } from '../../utils/logger';
import { CreateAccessTokenResponse } from "../../types/requestResponses";

@Route('/v1/accessToken')
@Tags('Token')
export class TokenController {
  @Post('/')
  @Security('basicAuth')
  public async generateAccessToken(
    @Body()
    body: {
      scopes: string[];
    },
    @Inject()
    params: {
      application: Application;
    },
  ): Promise<CreateAccessTokenResponse> {
    const { scopes } = body;
    const { application } = params;
    try {
      return await generateAccessToken({
        scopes,
        application,
      });
    } catch (e) {
      logger.error('generateAccessToken() error', e);
      throw e;
    }
  }
}
