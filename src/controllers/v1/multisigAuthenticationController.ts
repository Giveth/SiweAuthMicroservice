import { SiweMessage } from 'siwe';
import { Route, Tags, Post, Body } from 'tsoa';
import SafeApiKit from '@safe-global/api-kit';
import {
  AuthenticationRequest,
  AuthenticationResponse,
  MultisigAuthenticationRequest,
  MultisigAuthenticationResponse,
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

@Route('/v1/multisigAuthentication')
@Tags('Authentication')
export class MultisigAuthenticationController {
  @Post()
  public async authenticate(
    @Body() body: MultisigAuthenticationRequest,
  ): Promise<MultisigAuthenticationResponse> {
    try {
      const provider = getProvider(body.network);
      const safeOwner = provider.getSigner(0);

      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: safeOwner,
      });

      const safeService = new SafeApiKit({
        txServiceUrl: getSafeTransactionNetworkUrl(body.network),
        ethAdapter,
      });
      const message = new SiweMessage(body.message);
      const safeMultisigTransactionResponse = await safeService.getTransaction(
        body.transactionHash,
      );
      // const fields = await message.validate(body.signature);

      // const token = await generateAccessToken(fields);
      // logger.info(`User with address ${token.publicAddress} logged in`);

      return {
        // jwt: token.jwt,
        // expiration: token.expirationDate.valueOf(),
        // publicAddress: token.publicAddress,
        status: 'pending',
        pendingConfirmation: 0,
      };
    } catch (e) {
      logger.error('authenticationController error', e);
      throw e;
    }
  }
}
