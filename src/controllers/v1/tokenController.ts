import { Route, Tags, Post, Body, Security, Inject } from "tsoa";
import { AccessToken } from "../../entities/accessToken";
import { Application } from "../../entities/application";
import { generateJwtToken } from "../../services/tokenServie";
import { logger } from "../../utils/logger";


@Route("/v1/accessToken")
@Tags("Token")
export class TokenController {
  @Post("/")
  @Security('basicAuth')
  public async generateAccessToken(
    @Body() body: {
      scopes: string[],
    },
    @Inject()
    params: {
      application: Application
    }
  ): Promise<AccessToken> {
    const {scopes} = body
    const {application} = params
    try {
      return await generateJwtToken({
        scopes,
        application
      });
    } catch (e) {
      logger.error('generateAccessToken() error', e)
      throw e;
    }
  }
}
