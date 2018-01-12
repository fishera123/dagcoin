export class Config {

  public static DEFAULT_DEVICE_NAME = 'test name';

  limits: {
    totalCosigners: 6,
  };
  hub = 'testnetexplorer.dagcoin.org/wss/';
  deviceName = Config.DEFAULT_DEVICE_NAME;

  // TODO what is the difference between wallet and wallet client?
  wallet = {
    requiredCosigners: 2,
    totalCosigners: 3,
    spendUnconfirmed: false,
    reconnectDelay: 5000,
    idleDurationMin: 4,
    settings: {
      unitName: 'bytes',
      unitValue: 1,
      unitDecimals: 0,
      unitCode: 'oneByte',
      dagUnitName: 'DAG',
      dagUnitValue: 1000000,
      dagUnitDecimals: 6,
      dagUnitCode: 'one',
      alternativeName: 'US Dollar',
      alternativeIsoCode: 'USD',
    }
  };
  rates = {
    url: 'https://insight.bitpay.com:443/api/rates',
  };
  pushNotifications = {
    enabled: true,
    config: {
      android: {
        icon: 'push',
        iconColor: '#2F4053',
      },
      ios: {
        alert: 'true',
        badge: 'true',
        sound: 'true',
      },
      windows: {},
    },
  };
  autoUpdateWitnessesList: true;

  constructor() {
  }

}
