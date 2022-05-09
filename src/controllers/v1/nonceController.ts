import { generateNonce } from 'siwe';
import { Route, Get, Tags } from 'tsoa';

type nonceResponse = {
  message: string;
};

@Route('/v1/nonce')
@Tags('Nonce')
export class NonceController {
  @Get('/')
  public async getNonce(): Promise<nonceResponse> {
    return {
      message: generateNonce(),
    };
  }
}
