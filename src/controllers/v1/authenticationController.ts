import moment from 'moment';
import { SiweMessage } from 'siwe';
import { Route, Tags, Post, Body } from 'tsoa';
import { AccessToken } from '../../entities/accessToken';
import { GivethService } from '../../entities/givethService';
import { SiweNonce } from '../../entities/siweNonce';
import { findNonce } from '../../repositories/siweNonceRepository';
import { generateJwt } from '../../services/jwtService';
import {
  AuthenticationRequest,
  AuthenticationResponse,
} from '../../types/requestResponses';
import { StandardError } from '../../types/StandardError';
import { errorMessagesEnum } from '../../utils/errorMessages';
import { logger } from '../../utils/logger';
import { generateRandomString } from '../../utils/utils';

@Route('/v1/authentication')
@Tags('Authentication')
export class AuthenticationController {
  @Post('/')
  public async authenticate(
    @Body() body: AuthenticationRequest,
  ): Promise<AuthenticationResponse> {
    try {
      let message = new SiweMessage(body.message);
      const fields = await message.validate(body.signature);
      const whitelistedNonce = await findNonce(fields.nonce);

      if (!whitelistedNonce)
        throw new StandardError(errorMessagesEnum.NONCE_INVALID);
      if (whitelistedNonce.isExpired()) {
        // get rid of expired nonces
        await SiweNonce.delete({ id: whitelistedNonce.id });
        throw new StandardError(errorMessagesEnum.NONCE_EXPIRED);
      }

      const givethService = await GivethService.createQueryBuilder()
        .where(`serviceLabel = :label`, { label: body.serviceLabel })
        .getOne();

      // what service access being requested
      if (!givethService)
        throw new StandardError(errorMessagesEnum.SERVICE_NOT_IMPLEMENTED);

      const jti = `${
        givethService.serviceLabel
      }-${new Date().getTime()}-${generateRandomString(5)}`;

      const expirationDate = moment().add(1, 'hour');
      const jwt = generateJwt({
        issuer: Number(process.env.ISSUER_ID),
        publicAddress: fields.address,
        expirationDate: expirationDate.toDate(),
        givethServiceLabel: givethService.serviceLabel,
        jti: jti,
      });

      const token = await AccessToken.create({
        jwt: jwt,
        jti: jti,
        publicAddress: fields.address,
        issuer: process.env.ISSUER_ID,
        expirationDate: expirationDate,
        givethServiceId: givethService.id,
      }).save();

      return {
        jwt: token.jwt,
        expiration: token.expirationDate.valueOf(),
      };
    } catch (e) {
      logger.error('authenticationController error', e);
      throw e;
    }
  }
}
