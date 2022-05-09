import { generateNonce } from 'siwe';
import { Route, Tags, Post } from 'tsoa';
import { logger } from '../../utils/logger';

type authorizationResponse = {
  message: string;
};

@Route('/v1/authentication')
@Tags('Authentication')
export class AuthenticationController {
  @Post('/verify')
  public async getMessage(): Promise<authorizationResponse> {
    try {
      return {
        message: generateNonce(),
      };
    } catch(e) {
      logger.error('authorizationController error', e);
    }
  }
}
