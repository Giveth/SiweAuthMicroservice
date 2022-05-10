import moment from 'moment';
import { generateNonce } from 'siwe';
import { Route, Get, Tags } from 'tsoa';
import { SiweNonce } from '../../entities/siweNonce';

type nonceResponse = {
  message: string;
};

@Route('/v1/nonce')
@Tags('Nonce')
export class NonceController {
  @Get('/')
  public async getNonce(): Promise<nonceResponse> {
    const nonceExpiration = moment().add(5, 'minutes');
    const siweNonce = generateNonce();
    const nonce = SiweNonce.create({
      nonce: siweNonce,
      expirationDate: nonceExpiration,
    });

    await nonce.save();

    return {
      message: nonce.nonce,
    };
  }
}
