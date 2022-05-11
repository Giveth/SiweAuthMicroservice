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
    const nonce = await SiweNonce.create({
      nonce: generateNonce(),
      expirationDate: moment().add(5, 'minutes'),
    }).save();

    return {
      message: nonce.nonce,
    };
  }
}
