import { secp256k1 } from '@noble/curves/secp256k1';

import { PublicKey } from './PublicKey';

export class Signature {
  private compressed: boolean;
  private data: Buffer;
  private recovery: number;

  constructor(data: Buffer, recovery: number, compressed = true) {
    this.data = data;
    this.recovery = recovery;
    this.compressed = compressed;
  }

  static from(signature: string) {
    const temp = Buffer.from(signature, 'hex');

    let recovery = Number.parseInt(temp.subarray(0, 1).toString('hex'), 16) - 31;
    let compressed = true;

    if (recovery < 0) {
      compressed = false;
      recovery = recovery + 4;
    }

    const data = temp.subarray(1);

    return new Signature(data, recovery, compressed);
  }

  getPublicKey(message: string) {
    if (Buffer.isBuffer(message) && message.length !== 32) {
      return new Error('Expected a valid sha256 hash as message');
    }

    if (typeof message === 'string' && message.length !== 64) {
      return new Error('Expected a valid sha256 hash as message');
    }

    const sig = secp256k1.Signature.fromCompact(this.data.toString('hex'));

    // @ts-expect-error 3rd arguments for this class exists
    const temp = new secp256k1.Signature(sig.r, sig.s, this.recovery);

    return new PublicKey(temp.recoverPublicKey(message).toRawBytes());
  }

  toBuffer() {
    const buffer = Buffer.alloc(65);

    if (this.compressed) {
      buffer.writeUInt8(this.recovery + 31, 0);
    } else {
      buffer.writeUInt8(this.recovery + 27, 0);
    }

    this.data.copy(buffer, 1);

    return buffer;
  }

  toString() {
    return this.toBuffer().toString('hex');
  }
};
