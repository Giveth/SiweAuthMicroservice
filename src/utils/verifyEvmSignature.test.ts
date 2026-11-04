import { assert } from 'chai';
import { ethers } from 'ethers';
import sinon from 'sinon';
import { generateNonce, SiweMessage } from 'siwe';
import * as providerUtils from '@/src/utils/provider';
import * as verifier from '@/src/utils/verifySignature';
import { StandardError } from '@/src/types/StandardError';
import { errorMessagesEnum } from '@/src/utils/errorMessages';
import {
  recoverEoaSigner,
  verifyEvmSignature,
} from '@/src/utils/verifyEvmSignature';

// Pure unit tests: no DB, no RPC. The on-chain path is stubbed, except where
// the real getProvider is expected to refuse a chain synchronously.
describe('verifyEvmSignature', verifyEvmSignatureTestCases);

const siweText = (address: string, chainId: number) =>
  new SiweMessage({
    domain: 'www.giveth.io',
    address,
    statement: 'Sign in with Ethereum to Giveth',
    uri: 'https://www.giveth.io',
    version: '1',
    chainId,
    nonce: generateNonce(),
  }).prepareMessage();

function verifyEvmSignatureTestCases() {
  afterEach(() => sinon.restore());

  // Chains auth.giveth.io had no RPC for (BSC 56, Avalanche 43114,
  // HyperEVM 999) or that do not exist at all: an EOA must pass on every one.
  [1, 56, 43114, 999, 999999].forEach(chainId => {
    it(`accepts an EOA signature offline on chain ${chainId}`, async () => {
      const getProvider = sinon.spy(providerUtils, 'getProvider');
      const verifyMessage = sinon.spy(verifier, 'verifyMessage');
      const wallet = ethers.Wallet.createRandom();
      const message = siweText(wallet.address, chainId);

      const valid = await verifyEvmSignature({
        address: wallet.address,
        chainId,
        message,
        signature: await wallet.signMessage(message),
      });

      assert.isTrue(valid);
      assert.isTrue(getProvider.notCalled, 'no provider for an EOA');
      assert.isTrue(verifyMessage.notCalled, 'no eth_call for an EOA');
    });
  });

  it('accepts an EOA signature whose v is 0/1 (some hardware wallets)', async () => {
    const verifyMessage = sinon.spy(verifier, 'verifyMessage');
    const wallet = ethers.Wallet.createRandom();
    const message = siweText(wallet.address, 1);
    const signature = await wallet.signMessage(message);
    const bytes = ethers.utils.arrayify(signature);
    bytes[64] -= 27;

    const valid = await verifyEvmSignature({
      address: wallet.address,
      chainId: 1,
      message,
      signature: ethers.utils.hexlify(bytes),
    });

    assert.isTrue(valid);
    assert.isTrue(verifyMessage.notCalled);
  });

  it('matches the address case-insensitively', async () => {
    const wallet = ethers.Wallet.createRandom();
    const message = siweText(wallet.address, 1);

    const valid = await verifyEvmSignature({
      address: wallet.address.toLowerCase(),
      chainId: 1,
      message,
      signature: await wallet.signMessage(message),
    });

    assert.isTrue(valid);
  });

  it('falls back to the on-chain check on the message chain when the signer differs', async () => {
    const fakeProvider = {} as ethers.providers.JsonRpcProvider;
    const getProvider = sinon
      .stub(providerUtils, 'getProvider')
      .returns(fakeProvider);
    const verifyMessage = sinon.stub(verifier, 'verifyMessage').resolves(false);
    const claimed = ethers.Wallet.createRandom();
    const other = ethers.Wallet.createRandom();
    const message = siweText(claimed.address, 100);
    const signature = await other.signMessage(message);

    const valid = await verifyEvmSignature({
      address: claimed.address,
      chainId: 100,
      message,
      signature,
    });

    assert.isFalse(valid);
    assert.isTrue(getProvider.calledOnceWithExactly(100));
    assert.isTrue(
      verifyMessage.calledOnceWithExactly({
        signer: claimed.address,
        message,
        signature,
        provider: fakeProvider,
      }),
    );
  });

  it('accepts a smart-contract wallet that the on-chain check validates', async () => {
    sinon
      .stub(providerUtils, 'getProvider')
      .returns({} as ethers.providers.JsonRpcProvider);
    sinon.stub(verifier, 'verifyMessage').resolves(true);
    const safeAddress = ethers.Wallet.createRandom().address;
    const message = siweText(safeAddress, 100);
    // A contract wallet's signature: not a 65-byte ECDSA signature.
    const signature = ethers.utils.hexlify(ethers.utils.randomBytes(130));

    const valid = await verifyEvmSignature({
      address: safeAddress,
      chainId: 100,
      message,
      signature,
    });

    assert.isTrue(valid);
  });

  [
    'SignatureValidator#recoverSigner: invalid signature length',
    "SignatureValidator#recoverSigner: invalid signature 'v' value",
    'SignatureValidator: deployment',
  ].forEach(revert => {
    it(`maps validator revert "${revert}" to the generic invalid-signature error`, async () => {
      sinon
        .stub(providerUtils, 'getProvider')
        .returns({} as ethers.providers.JsonRpcProvider);
      sinon.stub(verifier, 'verifyMessage').rejects(new Error(revert));
      const address = ethers.Wallet.createRandom().address;

      let thrown: unknown;
      try {
        await verifyEvmSignature({
          address,
          chainId: 100,
          message: siweText(address, 100),
          signature: '0x1234',
        });
      } catch (e) {
        thrown = e;
      }

      assert.instanceOf(thrown, StandardError);
      assert.equal(
        (thrown as StandardError).code,
        errorMessagesEnum.INVALID_EVM_SIGNATURE.code,
      );
      assert.notInclude(
        (thrown as StandardError).message,
        'SignatureValidator',
      );
    });
  });

  it('does not mask RPC failures as invalid-signature', async () => {
    sinon
      .stub(providerUtils, 'getProvider')
      .returns({} as ethers.providers.JsonRpcProvider);
    sinon
      .stub(verifier, 'verifyMessage')
      .rejects(new Error('connection refused'));
    const address = ethers.Wallet.createRandom().address;

    let thrown: unknown;
    try {
      await verifyEvmSignature({
        address,
        chainId: 100,
        message: siweText(address, 100),
        signature: '0x1234',
      });
    } catch (e) {
      thrown = e;
    }

    assert.notInstanceOf(thrown, StandardError);
    assert.equal((thrown as Error).message, 'connection refused');
  });

  it('rejects with a 400 (not a 500) when a non-EOA signature is on a chain without a provider', async () => {
    const verifyMessage = sinon.spy(verifier, 'verifyMessage');
    const address = ethers.Wallet.createRandom().address;
    const message = siweText(address, 999999);

    let thrown: unknown;
    try {
      await verifyEvmSignature({
        address,
        chainId: 999999,
        message,
        signature: ethers.utils.hexlify(ethers.utils.randomBytes(65)),
      });
    } catch (e) {
      thrown = e;
    }

    const expected =
      errorMessagesEnum.UNSUPPORTED_NETWORK_FOR_SIGNATURE_VERIFICATION;
    assert.instanceOf(thrown, StandardError);
    assert.equal((thrown as StandardError).httpStatusCode, 400);
    assert.equal((thrown as StandardError).code, expected.code);
    assert.isTrue(verifyMessage.notCalled);
  });
}

describe('recoverEoaSigner', () => {
  it('returns null for a malformed signature instead of throwing', () => {
    assert.isNull(recoverEoaSigner('hello', '0x1234'));
  });

  it('recovers the signing address', async () => {
    const wallet = ethers.Wallet.createRandom();
    const signature = await wallet.signMessage('hello');
    assert.equal(recoverEoaSigner('hello', signature), wallet.address);
  });
});
