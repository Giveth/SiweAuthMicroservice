import { ethers } from 'ethers';
import * as providerUtils from '@/src/utils/provider';
import * as verifier from '@/src/utils/verifySignature';
import { StandardError } from '@/src/types/StandardError';
import { errorMessagesEnum } from '@/src/utils/errorMessages';
import { logger } from '@/src/utils/logger';

// Prefix of every revert string in the universal validator contract
// (verifySignature.ts), e.g. 'SignatureValidator#recoverSigner: invalid ...'.
const VALIDATOR_REVERT_PREFIX = 'SignatureValidator';

/**
 * The address that produced an EIP-191 (`personal_sign`) signature over
 * `message`, or null when the signature is not a well-formed ECDSA signature
 * (wrong length, a contract wallet's encoded signature, ERC-6492 wrapping).
 *
 * Pure math: no RPC, so it works for every chain, known or not.
 */
export function recoverEoaSigner(
  message: string,
  signature: string,
): string | null {
  try {
    return ethers.utils.verifyMessage(message, signature);
  } catch {
    return null;
  }
}

/**
 * Whether `signature` proves that `address` signed `message`.
 *
 * A plain wallet (EOA) is checked offline first. That is all a regular
 * wallet needs, so its sign-in no longer depends on an RPC for whatever chain
 * the wallet happens to be on. Before this, every login went through an
 * `eth_call` on that chain, and a wallet left on a chain we have no RPC for
 * (BSC, Avalanche, ...) failed with a 500 before its signature was even looked
 * at. An EIP-7702 account still passes here: its key keeps full control.
 *
 * Only when the signature does not recover to `address` can it still be
 * valid, and only for a smart-contract account (ERC-1271, or ERC-6492 for one
 * not yet deployed). That check has to run on the chain the account lives on,
 * which is what the SIWE `chainId` names, so it is the one case that needs an
 * RPC. A chain we have no provider for is reported as the client's problem (a
 * 400), not a server error.
 */
export async function verifyEvmSignature(params: {
  address: string;
  chainId: number;
  message: string;
  signature: string;
}): Promise<boolean> {
  const { address, chainId, message, signature } = params;

  const recovered = recoverEoaSigner(message, signature);
  if (recovered && recovered.toLowerCase() === address.toLowerCase()) {
    return true;
  }

  let provider: ethers.providers.JsonRpcProvider;
  try {
    provider = providerUtils.getProvider(chainId);
  } catch {
    throw new StandardError(
      errorMessagesEnum.UNSUPPORTED_NETWORK_FOR_SIGNATURE_VERIFICATION,
    );
  }

  // Universal validator: ERC-6492, ERC-1271 and ecrecover in one eth_call.
  try {
    return await verifier.verifyMessage({
      signer: address,
      message,
      signature,
      provider,
    });
  } catch (e: any) {
    // The validator reverts with 'SignatureValidator...' strings for a
    // malformed signature or a failed ERC-6492 deployment. Those are the
    // caller's fault, but their wording tells an attacker which check they
    // tripped, so log the detail and answer with the generic invalid-signature
    // error. Anything else (RPC down, ...) is ours and stays a 500.
    if (
      typeof e?.message === 'string' &&
      e.message.startsWith(VALIDATOR_REVERT_PREFIX)
    ) {
      logger.warn('Universal signature validator rejected the signature', {
        address,
        chainId,
        error: e.message,
      });
      throw new StandardError(errorMessagesEnum.INVALID_EVM_SIGNATURE);
    }
    throw e;
  }
}
