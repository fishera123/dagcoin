export class Constants {
  static readonly DERIVATION_STRATEGIES = {
    BIP44: 'BIP44',
    BIP48: 'BIP48',
  };

  static readonly UNITS = {
    one: {
      value: 1000000,
      maxDecimals: 0,
      minDecimals: 0,
    },
    oneByte: {
      value: 1,
      maxDecimals: 0,
      minDecimals: 0,
    },
  };
}
