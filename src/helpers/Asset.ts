export type AssetSymbol = 'HBD' | 'HIVE' | 'TESTS' | 'VESTS';

export class Asset {
  constructor(public readonly amount: number, public readonly symbol: AssetSymbol) {

  }

  static fromString(string: string) {
    const [quantity, symbol] = string.split(' ');

    if (!['HBD', 'HIVE', 'TESTS', 'VESTS'].includes(symbol)) {
      throw new Error(`Invalid asset symbol: ${symbol}`);
    }

    const amount = Number.parseFloat(quantity);

    if (!Number.isFinite(amount)) {
      throw new Error(`Invalid asset amount: ${quantity}`);
    }
    return new Asset(amount, symbol as AssetSymbol);
  }
}
