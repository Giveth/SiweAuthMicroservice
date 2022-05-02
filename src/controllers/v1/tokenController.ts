import { Route, Tags, Post, Body, Security, Inject } from 'tsoa';
import { Application } from '../../entities/application';
import { generateAccessToken } from '../../services/tokenServie';
import { logger } from '../../utils/logger';
import {
  CreateAccessTokenResponse,
  GenerateAccessTokenRequest,
} from '../../types/requestResponses';
import {
  createAccessTokenValidator,
  validateWithJoiSchema,
} from '../../validators/schemaValidators';

@Route('/v1/accessToken')
@Tags('Token')
export class TokenController {
  @Post('/')
  @Security('basicAuth')
  public async generateAccessToken(
    @Body()
    body: GenerateAccessTokenRequest,
    @Inject()
    params: {
      application: Application;
    },
  ): Promise<CreateAccessTokenResponse> {
    const { scopes } = body;
    const { application } = params;
    try {
      validateWithJoiSchema(body, createAccessTokenValidator);
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
