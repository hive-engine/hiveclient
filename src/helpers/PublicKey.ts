import bs58 from 'bs58';
import { ripemd160 } from '@noble/hashes/ripemd160';

export class PublicKey {
  private key: Uint8Array;
  private prefix: string;

  constructor(key: Uint8Array, prefix: string) {
    this.key = key;
    this.prefix = prefix;
  }

  static fromString(wif: string) {
    const { key, prefix } = decodePublic(wif);

    return new PublicKey(key, prefix);
  }

  static from(value: PublicKey | string) {
    return value instanceof PublicKey ? value : PublicKey.fromString(value);
  }

  toString() {
    return encodePublic(this.key, this.prefix);
  }

  toJSON() {
    return this.toString();
  }

  inspect() {
    return `PublicKey: ${this.toString()}`;
  }
}

const encodePublic = (key: Uint8Array, prefix: string) => {
  const checksum = ripemd160(key);

  return prefix + bs58.encode(new Uint8Array([...key, ...checksum.subarray(0, 4)]));
};

const decodePublic = (encodedKey: string) => {
  const prefix = encodedKey.slice(0, 3);

  encodedKey = encodedKey.slice(3);

  const uintArray = bs58.decode(encodedKey);

  const key = uintArray.subarray(0, -4);

  return { key, prefix };
};
