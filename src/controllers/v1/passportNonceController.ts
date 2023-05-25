import { Route, Get, Tags } from 'tsoa';
import axios from 'axios';
import { getPassportRequestHeaders } from '@/src/services/passport';

export type PassportNonce = {
  message: string;
  nonce: string;
};

@Route('/v1/passportNonce')
@Tags('Passport Nonce')
export class PassportNonceController {
  @Get('/')
  public async getNonce(): Promise<PassportNonce> {
    const response = await axios.get(
      'https://api.scorer.gitcoin.co/registry/signing-message',
      { headers: getPassportRequestHeaders() },
    );
    return response.data;
  }
}
