import { Route, Tags, Post, Body } from 'tsoa';
import {
  MultisigAuthenticationRequest,
  MultisigAuthenticationResponse,
} from '../../types/requestResponses';
import { StandardError } from '../../types/StandardError';
import { errorMessagesEnum } from '../../utils/errorMessages';
import { logger } from '../../utils/logger';
import { generateAccessToken } from '@/src/services/authenticationService';
import { firstOrCreateMultisigSession } from '@/src/repositories/multisigSessionRepository';
import {
  fetchSafeMessageByTimestamp,
  getSafeApiKit,
} from '@/src/services/safeServices';
import { validateJwt } from '@/src/services/jwtService';
import { MultisigStatuses } from '@/src/entities/multisigSession';

@Route('/v1/multisigAuthentication')
@Tags('Authentication')
export class MultisigAuthenticationController {
  @Post()
  public async authenticate(
    @Body() body: MultisigAuthenticationRequest,
  ): Promise<MultisigAuthenticationResponse> {
    try {
      let token: any;
      const safeService = await getSafeApiKit(body.network);
      const verifiedJwt = await validateJwt(body.jwt);

      const safeMessage = await fetchSafeMessageByTimestamp(
        body.safeAddress,
        body.safeMessageTimestamp,
        body.network,
      );

      if (!safeMessage)
        throw new StandardError(errorMessagesEnum.MULTISIG_MESSAGE_NOT_FOUND);

      const safeInfo = await safeService.getSafeInfo(body.safeAddress);

      if (safeMessage?.proposedBy?.value !== verifiedJwt.publicAddress)
        throw new StandardError(errorMessagesEnum.NOT_SAFE_OWNER);

      if (!safeInfo.owners.includes(verifiedJwt.publicAddress))
        throw new StandardError(errorMessagesEnum.NOT_SAFE_OWNER);

      const multisigSession = await firstOrCreateMultisigSession(
        safeMessage,
        safeMessage.safe,
        body.network,
      );

      if (
        multisigSession.multisigStatus(safeMessage) ===
        MultisigStatuses.Successful
      ) {
        token = await generateAccessToken({ address: safeMessage.safe });
        logger.info(`Multisig with address ${safeMessage.safe} logged in`);
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
