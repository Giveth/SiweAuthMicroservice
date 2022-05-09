import { generateNonce } from 'siwe';
import { Route, Tags, Post, Body } from 'tsoa';
import { logger } from '../../utils/logger';

type authenticationResponse = {
  message: string;
};

@Route('/v1/authentication')
@Tags('Authentication')
export class AuthenticationController {
  @Post('/verify')
  public async authenticate(
    @Body() body: AuthenticationRequest
  ): Promise<authenticationResponse> {
    try {

      return {
        message: generateNonce(),
      };
    } catch(e) {
      logger.error('authenticationController error', e);
    }
  }
}
