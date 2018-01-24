import {Constants} from './common/constants';
import {Utils} from '../../../../_base/utils';

const crypto = require('crypto');
const $ = require('preconditions').singleton();
const lodash = require('lodash');

const Bitcore = require('bitcore-lib');
const Mnemonic = require('bitcore-mnemonic');
const sjcl = require('sjcl');

const FIELDS = [
  'walletId',
  'network',
  'xPrivKey',
  'xPrivKeyEncrypted',
  'xPubKey',
  'publicKeyRing',
  'walletName',
  'm',
  'n',
  'externalSource',
  'mnemonic',
  'mnemonicEncrypted',
  'entropySource',
  'mnemonicHasPassphrase',
  'derivationStrategy',
  'account',
];

export class Credentials {

  version = '1.0.0';
  derivationStrategy = Constants.DERIVATION_STRATEGIES.BIP44;
  account = 0;
  walletName: string;
  walletId: any;
  network: any;
  xPrivKey: any;
  xPubKey: any;
  entropySource: any;
  publicKeyRing = [];

  mnemonic: any;
  mnemonicHasPassphrase: boolean;
  mnemonicEncrypted: any;

  externalSource: any;
  xPrivKeyEncrypted: any;
  m: any;
  n: any;

  /**
   * @param xKey
   * @return {string | string} network from extended private key or extended public key
   */
  public static getNetworkFromExtendedKey = function (xKey) {
    $.checkArgument(xKey && lodash.isString(xKey));
    return xKey.charAt(0) === 't' ? 'testnet' : 'livenet';
  };

  public static createWithMnemonic(network: string, passphrase, language, account): Credentials {
    Utils.checkNetwork(network);
    if (!wordsForLang[language]) {
      throw new Error('Unsupported language');
    }
    $.shouldBeNumber(account);

    let m = new Mnemonic(wordsForLang[language]);
    while (!Mnemonic.isValid(m.toString())) {
      m = new Mnemonic(wordsForLang[language]);
    }
    const credentials = new Credentials();

    credentials.network = network;
    credentials.account = account;
    credentials.xPrivKey = m.toHDPrivateKey(passphrase, network).toString();
    credentials.expand();
    credentials.mnemonic = m.phrase;
    credentials.mnemonicHasPassphrase = !!passphrase;

    Utils.debug('credentials: createWithMnemonic', network, passphrase, language, account);

    return credentials;
  }

  public static create(network: string, account): Credentials {
    Utils.checkNetwork(network);

    const credentials = new Credentials();

    credentials.network = network;
    credentials.account = account;
    credentials.xPrivKey = (new Bitcore.HDPrivateKey(network)).toString();
    credentials.expand();
    return credentials;
  }

  public static fromObj(obj): Credentials {
    const credentials = new Credentials();

    lodash.each(FIELDS, (k) => {
      credentials[k] = obj[k];
    });

    credentials.derivationStrategy = credentials.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP44;
    credentials.account = credentials.account || 0;

    $.checkState(credentials.xPrivKey || credentials.xPubKey || credentials.xPrivKeyEncrypted, 'invalid input');
    return credentials;
  }

  /**
   * note that mnemonic / passphrase is NOT stored. Now stored
   * @param {string} network
   * @param words
   * @param passphrase
   * @param account
   * @param derivationStrategy
   * @return {Credentials}
   */
  public static fromMnemonic(network: string, words, passphrase, account, derivationStrategy): Credentials {
    Utils.checkNetwork(network);
    $.shouldBeNumber(account);
    $.checkArgument(lodash.includes(lodash.values(Constants.DERIVATION_STRATEGIES), derivationStrategy));

    const m = new Mnemonic(words);
    const credentials = new Credentials();
    credentials.xPrivKey = m.toHDPrivateKey(passphrase, network).toString();
    credentials.mnemonic = words; // store the mnemonic
    credentials.mnemonicHasPassphrase = !!passphrase;
    credentials.account = account;
    credentials.derivationStrategy = derivationStrategy;
    credentials.expand();
    return credentials;
  }

  public static fromExtendedPrivateKey(xPrivKey, account): Credentials {
    const credentials = new Credentials();
    credentials.xPrivKey = xPrivKey;
    credentials.account = account || 0;
    credentials.expand();
    return credentials;
  }

  /*
   * BWC uses
   * xPrivKey -> m/44'/network'/account' -> Base Address Key
   * so, xPubKey is PublicKeyHD(xPrivKey.derive("m/44'/network'/account'").
   *
   * For external sources, this derivation should be done before
   * call fromExtendedPublicKey
   *
   * entropySource should be a HEX string containing pseudo-random data, that can
   * be deterministically derived from the xPrivKey, and should not be derived from xPubKey
   */
  public static fromExtendedPublicKey(xPubKey, source, entropySourceHex, account, derivationStrategy): Credentials {
    $.checkArgument(entropySourceHex);
    $.shouldBeNumber(account);
    $.checkArgument(lodash.includes(lodash.values(Constants.DERIVATION_STRATEGIES), derivationStrategy));

    const entropyBuffer = new Buffer(entropySourceHex, 'hex');
    // require at least 112 bits of entropy
    $.checkArgument(entropyBuffer.length >= 14, 'At least 112 bits of entropy are needed');

    const credentials = new Credentials();
    credentials.xPubKey = xPubKey;
    credentials.entropySource = Bitcore.crypto.Hash.sha256sha256(entropyBuffer).toString('hex');
    credentials.account = account;
    credentials.derivationStrategy = derivationStrategy;
    credentials.externalSource = source;
    credentials.expand();
    return credentials;
  }

  clearMnemonic() {
    delete this.mnemonic;
    delete this.mnemonicEncrypted;
  }

  getMnemonic() {
    if (this.mnemonicEncrypted && !this.mnemonic) {
      throw new Error('Credentials are encrypted');
    }

    return this.mnemonic;
  }

  expand() {
    $.checkState(this.xPrivKey || (this.xPubKey && this.entropySource));

    const network = Credentials.getNetworkFromExtendedKey(this.xPrivKey || this.xPubKey);
    if (this.network) {
      $.checkState(this.network === network);
    } else {
      this.network = network;
    }

    if (this.xPrivKey) {
      const xPrivKey = new Bitcore.HDPrivateKey.fromString(this.xPrivKey);

      // this extra derivation is not to share a non hardened xPubKey to the server.
      const addressDerivation = xPrivKey.derive(this.getBaseAddressDerivationPath());
      this.xPubKey = (new Bitcore.HDPublicKey(addressDerivation)).toString();
    }

    this.publicKeyRing = [{
      xPubKey: this.xPubKey,
    }];
  }

  /**
   *
   * @return {string}
   * @throws Error when derivationStragies is not either BIP44 or BIP48
   */
  getBaseAddressDerivationPath(): string {
    let purpose;
    switch (this.derivationStrategy) {
      case Constants.DERIVATION_STRATEGIES.BIP44:
        purpose = '44';
        break;
      case Constants.DERIVATION_STRATEGIES.BIP48:
        purpose = '48';
        break;
      default:
        throw new Error('undefined derivationStrategy: ' + this.derivationStrategy);
    }

    const coin = (this.network === 'livenet' ? '0' : '1');
    return `m/${purpose}'/${coin}'/${this.account}'`;
  }

  toObj() {
    const self = this;

    if (self.hasPrivKeyEncrypted()) {
      self.lock();
    }

    const x = {};
    lodash.each(FIELDS, (k) => {
      if (k !== 'xPrivKey' && k !== 'mnemonic' && k !== 'xPrivKeyEncrypted' && k !== 'mnemonicEncrypted') {
        x[k] = self[k];
      }
    });
    return x;
  }


  getDerivedXPrivKey() {
    const path = this.getBaseAddressDerivationPath();
    return new Bitcore.HDPrivateKey(this.xPrivKey, this.network).derive(path);
  }


  addWalletInfo(walletName, m, n) {
    // this.walletId = crypto.createHash("sha256").update(this.xPubKey, "utf8").digest("base64");
    this.walletName = walletName;
    this.m = m;
    this.n = n;


    // Use m/48' for multisig hardware wallets
    if (!this.xPrivKey && this.externalSource && n > 1) {
      this.derivationStrategy = Constants.DERIVATION_STRATEGIES.BIP48;
    }

    if (n === 1) {
      this.addPublicKeyRing([{
        xPubKey: this.xPubKey,
      }]);
    }
  }

  hasWalletInfo(): boolean {
    return !!this.n;
  }

  isPrivKeyEncrypted(): boolean {
    return (!!this.xPrivKeyEncrypted) && !this.xPrivKey;
  }

  hasPrivKeyEncrypted(): boolean {
    return (!!this.xPrivKeyEncrypted);
  }

  setPrivateKeyEncryption(password, opts) {
    if (this.xPrivKeyEncrypted) {
      throw new Error('Encrypted Privkey Already exists');
    }

    if (!this.xPrivKey) {
      throw new Error('No private key to encrypt');
    }

    this.xPrivKeyEncrypted = sjcl.encrypt(password, this.xPrivKey, opts);
    if (!this.xPrivKeyEncrypted) {
      throw new Error('Could not encrypt');
    }

    if (this.mnemonic) {
      this.mnemonicEncrypted = sjcl.encrypt(password, this.mnemonic, opts);
    }
  }


  disablePrivateKeyEncryption() {
    if (!this.xPrivKeyEncrypted) {
      throw new Error('Private Key is not encrypted');
    }

    if (!this.xPrivKey) {
      throw new Error('Wallet is locked, cannot disable encryption');
    }

    this.xPrivKeyEncrypted = null;
    this.mnemonicEncrypted = null;
  }


  lock() {
    if (!this.xPrivKeyEncrypted) {
      throw new Error('Could not lock, no encrypted private key');
    }

    delete this.xPrivKey;
    delete this.mnemonic;
  }

  unlock(password) {
    $.checkArgument(password);

    if (this.xPrivKeyEncrypted) {
      this.xPrivKey = sjcl.decrypt(password, this.xPrivKeyEncrypted);
      if (this.mnemonicEncrypted) {
        this.mnemonic = sjcl.decrypt(password, this.mnemonicEncrypted);
      }
    }
  }

  addPublicKeyRing(publicKeyRing) {
    this.publicKeyRing = lodash.clone(publicKeyRing);
  }

  canSign(): boolean {
    return !!this.xPrivKey || !!this.xPrivKeyEncrypted;
  }

  setNoSign() {
    delete this.xPrivKey;
    delete this.xPrivKeyEncrypted;
    delete this.mnemonic;
    delete this.mnemonicEncrypted;
  }

  isComplete(): boolean {
    if (!this.m || !this.n) {
      return false;
    }
    return !(!this.publicKeyRing || this.publicKeyRing.length !== this.n);
  }

  hasExternalSource(): boolean {
    return typeof this.externalSource === 'string';
  }

  getExternalSourceName() {
    return this.externalSource;
  }

  hashFromEntropy(prefix, length) {
    $.checkState(prefix);
    const b = new Buffer(this.entropySource, 'hex');
    const b2 = Bitcore.crypto.Hash.sha256hmac(b, new Buffer(prefix));
    return b2.slice(0, length);
  }

}

const wordsForLang = {
  en: Mnemonic.Words.ENGLISH,
  es: Mnemonic.Words.SPANISH,
  ja: Mnemonic.Words.JAPANESE,
  zh: Mnemonic.Words.CHINESE,
  fr: Mnemonic.Words.FRENCH,
};
