import { sha256 } from '@noble/hashes/sha256';
import { Input } from '@noble/hashes/utils';

export const doubleSha256 = (input: Input) => {
  const dbl = sha256(sha256(input));

  return dbl;
};
