import { secp256k1 } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import bs58 from 'bs58';

import { doubleSha256 } from '~/utils';

import { PublicKey } from './PublicKey';

const NETWORK_ID = [0x80];

const encodePrivate = (key: Uint8Array) => {
  const checksum = doubleSha256(key);

  return bs58.encode(new Uint8Array([...key, ...checksum.slice(0, 4)]));
};

const decodePrivate = (encodedKey: string) => {
  return bs58.decode(encodedKey).slice(0, -4);
};

export class PrivateKey {
  private key: Uint8Array;

  constructor(key: Uint8Array) {
    this.key = key;

    try {
      secp256k1.getPublicKey(key);
    } catch {
      throw new Error('invalid private key');
    }
  }

  static fromLogin(username: string, password: string, role = 'active') {
    const seed = username + role + password;

    return PrivateKey.fromSeed(seed);
  }

  static fromSeed(seed: string) {
    return new PrivateKey(sha256(seed));
  }

  static fromString(wif: string) {
    return new PrivateKey(decodePrivate(wif).subarray(1));
  }

  createPublic(prefix = 'STM') {
    return new PublicKey(secp256k1.getPublicKey(this.key), prefix);
  }

  toString() {
    return encodePrivate(new Uint8Array([...NETWORK_ID, ...this.key]));
  }
}
