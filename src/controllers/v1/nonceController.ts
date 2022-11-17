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
    const nonceLife = Number(process.env.NONCE_LIFE_MINUTES) || 5
    const nonce = await SiweNonce.create({
      nonce: generateNonce(),
      expirationDate: moment().add(nonceLife, 'minutes'),
    }).save();

    return {
      message: nonce.nonce,
    };
  }
}
