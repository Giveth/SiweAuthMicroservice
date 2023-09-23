import { Route, Tags, Post, Body } from 'tsoa';
import {
  MultisigAuthenticationResponse,
  MultisigAuthorizationRequest,
} from '../../types/requestResponses';
import { StandardError } from '../../types/StandardError';
import { errorMessagesEnum } from '../../utils/errorMessages';
import { logger } from '../../utils/logger';
import { MultisigStatuses } from '@/src/entities/multisigSession';
import { generateAccessToken } from '@/src/services/authenticationService';
import { findNonExpiredMultisigSessions } from '@/src/repositories/multisigSessionRepository';
import { fetchSafeMessage, getSafeApiKit } from '@/src/services/safeServices';
import { validateJwt } from '@/src/services/jwtService';

@Route('/v1/multisigAuthorization')
@Tags('Authorization')
export class MultisigAuthorizationController {
  @Post()
  public async authorize(
    @Body() body: MultisigAuthorizationRequest,
  ): Promise<MultisigAuthenticationResponse> {
    try {
      let token: any;
      const safeService = await getSafeApiKit(body.network);

      const multisigSession = await findNonExpiredMultisigSessions(
        body.multisigAddress,
        body.network,
      );

      if (!multisigSession)
        throw new StandardError(errorMessagesEnum.MULTISIG_SESSION_NOT_FOUND);

      const safeInfo = await safeService.getSafeInfo(
        multisigSession.multisigAddress,
      );

      const verifiedJwt = await validateJwt(body.jwt);

      if (!safeInfo.owners.includes(verifiedJwt.publicAddress))
        throw new StandardError(errorMessagesEnum.NOT_SAFE_OWNER);

      const safeMessage = await fetchSafeMessage(
        multisigSession.safeMessageHash,
        body.network,
      );

      if (
        multisigSession.multisigStatus(safeMessage) ===
        MultisigStatuses.Successful
      ) {
        token = await generateAccessToken({
          address: multisigSession.multisigAddress,
        });
        logger.info(
          `Multisig with address ${multisigSession.multisigAddress} logged in`,
        );
      }

      return {
        jwt: token?.jwt,
        expiration: multisigSession.expirationDate.valueOf(),
        publicAddress: multisigSession.multisigAddress,
        status: multisigSession.status,
      };
    } catch (e) {
      logger.error('multisigAuthenticationController error', e);
      throw e;
    }
  }
}
