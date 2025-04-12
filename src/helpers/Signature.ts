import { secp256k1 } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

import { PublicKey } from './PublicKey';

export class Signature {
  private compressed: boolean;
  private data: Uint8Array;
  private recovery: number;

  constructor(data: Uint8Array, recovery: number, compressed = true) {
    this.data = data;
    this.recovery = recovery;
    this.compressed = compressed;
  }

  static from(signature: string) {
    const temp = hexToBytes(signature);

    let recovery = Number.parseInt(bytesToHex(temp.subarray(0, 1)), 16) - 31;
    let compressed = true;

    if (recovery < 0) {
      compressed = false;
      recovery = recovery + 4;
    }

    const data = temp.subarray(1);

    return new Signature(data, recovery, compressed);
  }

  getPublicKey(message: string | Uint8Array) {
    if (message instanceof Uint8Array && message.length !== 32) {
      return new Error('Expected a valid sha256 hash as message');
    }

    if (typeof message === 'string' && message.length !== 64) {
      return new Error('Expected a valid sha256 hash as message');
    }

    const sig = secp256k1.Signature.fromCompact(bytesToHex(this.data));

    // @ts-expect-error 3rd arguments for this class exists
    const temp = new secp256k1.Signature(sig.r, sig.s, this.recovery);

    return new PublicKey(temp.recoverPublicKey(message).toRawBytes());
  }

  toBuffer() {
    const buffer = new Uint8Array(65);

    if (this.compressed) {
      buffer[0] = this.recovery + 31;
    } else {
      buffer[0] = this.recovery + 27;
    }

    buffer.set(this.data, 1);

    return buffer;
  }

  toString() {
    return bytesToHex(this.toBuffer());
  }
};
