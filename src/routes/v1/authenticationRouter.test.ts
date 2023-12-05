import axios from 'axios';
import { serverUrl } from '../../../test/testUtils';
import { assert } from 'chai';
import { SiweNonce } from '../../entities/siweNonce';
import { generateNonce, SiweMessage } from 'siwe';
import moment from 'moment';
import { ethers } from 'ethers';
import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';
import { Header, Payload, SIWS } from '@web3auth/sign-in-with-solana';
import base58 from 'bs58';

const ethPrivateKey = process.env.PRIVATE_ETHERS_TEST_KEY as string;
const ethPublicKey = process.env.PUBLIC_ETHERS_TEST_KEY as string;
const provider = ethers.getDefaultProvider();

const solanaPrivateKey = process.env.PRIVATE_SOLANA_TEST_KEY as string;
const solanaPublicKey = process.env.PUBLIC_SOLANA_TEST_KEY as string;

describe('/authentication test cases', authenticationTestCases);

function authenticationTestCases() {
  const domain = 'localhost';
  const origin = 'https://giveth.io';

  it('should return the public address, jwt and expiration', async () => {
    const nonce = await SiweNonce.create({
      nonce: generateNonce(),
      expirationDate: moment().add(5, 'minutes').toDate(),
    }).save();

    const wallet = new ethers.Wallet(ethPrivateKey, provider);

    const siweMessage = new SiweMessage({
      domain,
      address: ethPublicKey,
      nonce: nonce.nonce, // verification servers gives
      statement: 'This is a test statement.',
      uri: origin,
      version: '1',
      chainId: 1,
    });

    const textMessage = siweMessage.prepareMessage();
    const signature = await wallet.signMessage(textMessage);

    // for future stubbing examples
    // sinon.stub(SiweMessage.prototype, 'validate').resolves(siweMessage);
    const result = await axios.post(`${serverUrl}/v1/authentication`, {
      message: textMessage,
      nonce: nonce.nonce,
      signature: signature,
    });
    assert.equal(result.status, 200);
    assert.equal(result.data.publicAddress, ethPublicKey);
  });

  it('should authenticate with nonce fetched from the server', async () => {
    const nonceResult = await axios.get(`${serverUrl}/v1/nonce`);
    const nonce = nonceResult.data.message;

    const wallet = new ethers.Wallet(ethPrivateKey, provider);

    const siweMessage = new SiweMessage({
      domain,
      address: ethPublicKey,
      nonce: nonce, // verification servers gives
      statement: 'This is a test statement.',
      uri: origin,
      version: '1',
      chainId: 1,
    });

    const textMessage = siweMessage.prepareMessage();
    const signature = await wallet.signMessage(textMessage);

    // for future stubbing examples
    // sinon.stub(SiweMessage.prototype, 'validate').resolves(siweMessage);
    const result = await axios.post(`${serverUrl}/v1/authentication`, {
      message: textMessage,
      nonce: nonce,
      signature: signature,
    });
    assert.equal(result.status, 200);
    assert.equal(result.data.publicAddress, ethPublicKey);
  });

  it('should authenticate with nonce fetched from the server - solana', async () => {
    const nonceResult = await axios.get(`${serverUrl}/v1/nonce`);
    const nonce = nonceResult.data.message;

    const keypair = Keypair.fromSecretKey(base58.decode(solanaPrivateKey));

    const header = new Header();
    header.t = 'sip99';

    const payload = new Payload();

    payload.domain = domain;
    payload.address = solanaPublicKey;
    payload.uri = origin;
    payload.statement = 'This is a test statement';
    payload.version = '1';
    payload.chainId = 0;
    payload.nonce = nonce;

    const message = new SIWS({
      header,
      payload,
    }).prepareMessage();

    const signature = nacl.sign.detached(
      Buffer.from(message),
      keypair.secretKey,
    );

    const data = {
      message,
      signature: base58.encode(signature),
      payload: payload,
    };
    const result = await axios.post(
      `${serverUrl}/v1/solanaAuthentication`,
      data,
    );
    assert.equal(result.status, 200);
    assert.equal(result.data.publicAddress, solanaPublicKey);
  });
}
