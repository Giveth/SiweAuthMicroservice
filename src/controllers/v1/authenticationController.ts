import { SiweMessage } from 'siwe';
import { Route, Tags, Post, Body } from 'tsoa';
import { SiweNonce } from '../../entities/siweNonce';
import { findNonce } from '../../repositories/siweNonceRepository';
import { ethers } from 'ethers';
import {
  AccessTokenFields,
  generateAccessToken,
} from '../../services/authenticationService';
import {
  AuthenticationRequest,
  AuthenticationResponse,
  solanaAuthenticateRequest,
} from '../../types/requestResponses';
import { StandardError } from '../../types/StandardError';
import { errorMessagesEnum } from '../../utils/errorMessages';
import { logger } from '../../utils/logger';
import { Header, Payload, SIWS } from '@web3auth/sign-in-with-solana';
import { getProvider, NETWORK_IDS } from '@/src/utils/provider';

@Tags('Authentication')
export class AuthenticationController {
  @Route('/v1/authentication')
  @Post()
  public async ethereumAuthenticate(
    @Body() body: AuthenticationRequest,
  ): Promise<AuthenticationResponse> {
    const provider = getProvider(NETWORK_IDS.XDAI);

    const isContract = async (address: string) => {
      const code = await provider.getCode(address);
      return code !== '0x';
    };

    const erc1271Verify = async (
      address: string,
      message: string,
      signature: string,
    ) => {
      const messageHash = ethers.utils.hashMessage(message);
      const contract = new ethers.Contract(
        address,
        [
          {
            name: 'isValidSignature',
            type: 'function',
            stateMutability: 'view',
            inputs: [
              { name: 'data', type: 'bytes32' },
              { name: 'signature', type: 'bytes' },
            ],
            outputs: [{ name: '', type: 'bytes4' }],
          },
        ],
        provider,
      );
      const result = await contract.isValidSignature(messageHash, signature);
      return result === '0x1626ba7e';
    };

    const message = new SiweMessage(body.message);
    try {
      const fields = await message.validate(body.signature);
      const tokenFields = {
        ...fields,
        nonce: body.nonce,
      };
      return await this.issueToken(tokenFields, body.nonce);
    } catch (e: any) {
      logger.error('Error from ethereumAuthenticate', e);
      logger.error('Error from ethereumAuthenticate Message', e.message);
      if (e.message.contains('Invalid signature')) {
        logger.error('Invalid signature, trying ERC1271 verification');
        const address = message.address;
        if (await isContract(address)) {
          const isValid = await erc1271Verify(
            address,
            body.message,
            body.signature,
          );
          logger.info('ERC1271 verification result', isValid);
          if (isValid) {
            const fields = {
              address: message.address,
              chainId: message.chainId,
              nonce: body.nonce,
            };
            return await this.issueToken(fields, body.nonce);
          }
        }
      }
      throw e;
    }
  }

  @Route('/v1/solanaAuthentication')
  @Post()
  public async solanaAuthenticate(
    @Body() body: solanaAuthenticateRequest,
  ): Promise<AuthenticationResponse> {
    try {
      const { signature, message, nonce, address } = body;

      const header = new Header();
      header.t = 'sip99';

      const msg = new SIWS(message);
      const payload = new Payload();
      payload.address = address;
      payload.nonce = nonce;

      const result = await msg.verify({
        payload,
        signature: {
          t: 'sip99',
          s: signature,
        },
      });

      if (!result.success) {
        logger.error('authenticationController error', result.error);
        throw new StandardError(
          errorMessagesEnum.INVALID_SOLANA_SIGNATURE_OR_LOGIN_DATA,
        );
      }

      return await this.issueToken(result.data.payload, nonce);
    } catch (e) {
      logger.error('authenticationController error', e);
      throw e;
    }
  }

  async issueToken(
    fields: { nonce: string } & AccessTokenFields,
    requestNonce: string,
  ): Promise<AuthenticationResponse> {
    const whitelistedNonce = await findNonce(fields.nonce);
    if (!whitelistedNonce || fields.nonce !== requestNonce)
      throw new StandardError(errorMessagesEnum.NONCE_INVALID);

    if (whitelistedNonce.isExpired()) {
      logger.info(
        'POST authenticate, whitelistedNonce is expired',
        whitelistedNonce,
      );
      await SiweNonce.delete({ id: whitelistedNonce.id });
      throw new StandardError(errorMessagesEnum.NONCE_EXPIRED);
    }
    const token = await generateAccessToken(fields);
    logger.info(`User with address ${token.publicAddress} logged in`);

    // clean up to prevent reuse
    await SiweNonce.delete({ id: whitelistedNonce.id });
    return {
      jwt: token.jwt,
      expiration: token.expirationDate.valueOf(),
      publicAddress: token.publicAddress,
    };
  }
}
