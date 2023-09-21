import { SiweMessage } from 'siwe';
import { Route, Tags, Post, Body } from 'tsoa';
import SafeApiKit from '@safe-global/api-kit';
import {
  AuthenticationRequest,
  AuthenticationResponse,
  MultisigAuthenticationRequest,
  MultisigAuthenticationResponse,
  MultisigAuthorizationRequest,
} from '../../types/requestResponses';
import { StandardError } from '../../types/StandardError';
import { errorMessagesEnum } from '../../utils/errorMessages';
import { logger } from '../../utils/logger';
import {
  getProvider,
  getSafeTransactionNetworkUrl,
} from '@/src/utils/provider';
import { EthersAdapter } from '@safe-global/protocol-kit';
import { ethers } from 'ethers';
import { MultisigSession } from '@/src/entities/multisigSession';
import moment from 'moment';
import { generateAccessToken } from '@/src/services/authenticationService';
import { verify } from 'jsonwebtoken';
import { findAccessTokenByUniqueIdentifiers } from '@/src/repositories/accessTokenRepository';
import {
  findNonExpiredMultisigSessions,
  firstOrCreateMultisigSession,
} from '@/src/repositories/multisigSessionRepository';

@Route('/v1/multisigAuthorization')
@Tags('Authorization')
export class MultisigAuthorizationController {
  @Post()
  public async authorize(
    @Body() body: MultisigAuthorizationRequest,
  ): Promise<MultisigAuthenticationResponse> {
    try {
      let token: any;
      const provider = getProvider(body.network);
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: provider,
      });
      const safeService = new SafeApiKit({
        txServiceUrl: getSafeTransactionNetworkUrl(body.network),
        ethAdapter,
      });

      const multisigSession = await findNonExpiredMultisigSessions(
        body.multisigAddress,
        body.network,
      );

      if (!multisigSession)
        throw new StandardError(errorMessagesEnum.MULTISIG_SESSION_NOT_FOUND);

      const safeMultisigTransactionResponse = await safeService.getTransaction(
        multisigSession.safeTransactionHash,
      );

      const safeAddress = safeMultisigTransactionResponse.safe;
      const safeInfo = await safeService.getSafeInfo(safeAddress);

      const verifiedJwt = verify(
        body.jwt,
        process.env.JWT_SECRET as string,
      ) as any;

      const dbAccessToken = await findAccessTokenByUniqueIdentifiers(
        body.jwt,
        verifiedJwt.jti,
      );

      if (!dbAccessToken)
        throw new StandardError(errorMessagesEnum.JWT_NOT_FOUND);

      if (!safeInfo.owners.includes(verifiedJwt.publicAddress))
        throw new StandardError(errorMessagesEnum.NOT_SAFE_OWNER);

      if (safeMultisigTransactionResponse.isSuccessful) {
        token = await generateAccessToken({ address: safeAddress });
        logger.info(
          `Multisig with address ${multisigSession.multisigAddress} logged in`,
        );
      }

      return {
        jwt: token?.jwt,
        expiration: multisigSession.expirationDate.valueOf(),
        publicAddress: multisigSession.multisigAddress,
        status: multisigSession.multisigStatus(
          safeMultisigTransactionResponse?.isSuccessful,
        ),
      };
    } catch (e) {
      logger.error('multisigAuthenticationController error', e);
      throw e;
    }
  }
}
