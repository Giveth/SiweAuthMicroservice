import { generateNonce } from 'siwe';
import { Route, Tags, Post } from 'tsoa';
import { AuthorizationResponse } from '../../types/requestResponses';
import { logger } from '../../utils/logger';

@Route('/v1/authorization')
@Tags('Authorization')
export class AuthorizationController {
  @Post('/')
  public async authorize(): Promise<AuthorizationResponse> {
    try {
      return {
        message: generateNonce(),
      };
    } catch (e) {
      logger.error('authorizationController error', e);
      throw e;
    }
  }
}
