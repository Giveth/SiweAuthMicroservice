import { generateNonce } from 'siwe';
import { Route, Tags, Post } from 'tsoa';
import { logger } from '../../utils/logger';

type authorizationResponse = {
  message: string;
};

@Route('/v1/authorization')
@Tags('Authorization')
export class AuthorizationController {
  @Post('/verify')
  public async authorize(): Promise<authorizationResponse> {
    try {
      return {
        message: generateNonce(),
      };
    } catch(e) {
      logger.error('authorizationController error', e);
    }
  }
}
