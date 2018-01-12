export class Profile {
  version = '1.0.0';
  mnemonic: string;
  mnemonicEncrypted: string;
  createdOn: number;
  credentials: any;
  xPrivKey: any; // TODO fix this field type
  xPrivKeyEncrypted: any;
  tempDeviceKey: any;
  prevTempDeviceKey: any;
  my_device_address: any;

  static create = function (opts) {
    const options = opts || {};

    const x = new Profile();
    x.createdOn = Date.now();
    x.credentials = options.credentials || [];
    if (!options.xPrivKey && !options.xPrivKeyEncrypted) {
      throw Error('no xPrivKey, even encrypted');
    }
    if (!options.mnemonic && !options.mnemonicEncrypted) {
      throw Error('no mnemonic, even encrypted');
    }
    if (!options.tempDeviceKey) {
      throw Error('no tempDeviceKey');
    }
    x.xPrivKey = options.xPrivKey;
    x.mnemonic = options.mnemonic;
    x.xPrivKeyEncrypted = options.xPrivKeyEncrypted;
    x.mnemonicEncrypted = options.mnemonicEncrypted;
    x.tempDeviceKey = options.tempDeviceKey;
    x.prevTempDeviceKey = options.prevTempDeviceKey; // optional
    x.my_device_address = options.my_device_address;
    return x;
  }

  constructor() { }
}

