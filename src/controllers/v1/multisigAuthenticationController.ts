import { Route, Tags, Post, Body } from 'tsoa';
import {
  MultisigAuthenticationRequest,
  MultisigAuthenticationResponse,
} from '../../types/requestResponses';
import { StandardError } from '../../types/StandardError';
import { errorMessagesEnum } from '../../utils/errorMessages';
import { logger } from '../../utils/logger';
import { generateAccessToken } from '@/src/services/authenticationService';
import {
  findNonExpiredMultisigSessions,
  firstOrCreateMultisigSession,
} from '@/src/repositories/multisigSessionRepository';
import {
  fetchSafeMessage,
  fetchSafeMessageByTimestamp,
  getSafeApiKit,
} from '@/src/services/safeServices';
import { validateJwt } from '@/src/services/jwtService';
import {
  MultisigSession,
  MultisigStatuses,
} from '@/src/entities/multisigSession';
import moment from 'moment';

@Route('/v1/multisigAuthentication')
@Tags('Authentication')
export class MultisigAuthenticationController {
  @Post()
  public async authenticate(
    @Body() body: MultisigAuthenticationRequest,
  ): Promise<MultisigAuthenticationResponse> {
    try {
      let token: any;
      let multisigSession: any;
      let safeMessage: any;
      const safeService = await getSafeApiKit(body.network);
      const verifiedJwt = await validateJwt(body.jwt);

      multisigSession = await findNonExpiredMultisigSessions(
        body.safeAddress,
        body.network,
      );

      if (!multisigSession && !body.approvalExpirationDays) {
        throw new StandardError(errorMessagesEnum.MULTISIG_INVALID_REQUEST);
      }

      if (!multisigSession && body.safeMessageTimestamp) {
        safeMessage = await fetchSafeMessageByTimestamp(
          body.safeAddress,
          body.safeMessageTimestamp,
          body.network,
        );
      } else if (multisigSession && !body.safeMessageTimestamp) {
        safeMessage = await fetchSafeMessage(
          multisigSession.safeMessageHash,
          body.network,
        );
      } else {
        throw new StandardError(errorMessagesEnum.MULTISIG_INVALID_REQUEST);
      }

      if (!safeMessage)
        throw new StandardError(errorMessagesEnum.MULTISIG_MESSAGE_NOT_FOUND);

      const safeInfo = await safeService.getSafeInfo(body.safeAddress);

      if (
        !multisigSession &&
        safeMessage?.proposedBy?.value !== verifiedJwt.publicAddress
      )
        throw new StandardError(errorMessagesEnum.NOT_SAFE_OWNER);

      if (!safeInfo.owners.includes(verifiedJwt.publicAddress))
        throw new StandardError(errorMessagesEnum.NOT_SAFE_OWNER);

      if (!multisigSession) {
        multisigSession = MultisigSession.create({
          approvalExpirationDate: moment()
            .add(body.approvalExpirationDays, 'days')
            .toDate(),
          expirationDate: moment().add(1, 'week').toDate(),
          safeMessageHash: safeMessage.messageHash,
          multisigAddress: body.safeAddress,
          network: body.network,
          active: true,
        });
      }

      if (
        (await multisigSession.multisigStatus(safeMessage)) ===
        MultisigStatuses.Successful
      ) {
        if (
          multisigSession.expirationDate !==
          multisigSession.approvalExpirationDAte
        ) {
          multisigSession.expirationDate =
            multisigSession.approvalExpirationDate;
          await multisigSession.save();
        }

        token = await generateAccessToken({
          address: body.safeAddress,
          expirationDate: multisigSession.expirationDate,
        });
        logger.info(`Multisig with address ${body.safeAddress} logged in`);
      }

      return {
        jwt: token?.jwt,
        expiration: multisigSession.expirationDate.valueOf(),
        publicAddress: multisigSession.multisigAddress,
        safeMessageHash: multisigSession.safeMessageHash,
        status: multisigSession.status,
      };
    } catch (e) {
      logger.error('multisigAuthenticationController error', e);
      throw e;
    }
  }
}
