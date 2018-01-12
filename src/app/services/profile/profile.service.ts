import {Injectable} from '@angular/core';
import {Root} from '../../models/root.model';
import {Profile} from '../../models/profile.model';
import {WalletClient} from '../../models/wallet.client.model';
import {debug} from 'util';
import {ConfigService} from '../config/config.service';
import {Utils} from '../../_base/utils';
import {BaseService} from '../../_base/base.service';
import {reject} from 'q';
import {BitcoreWalletClientApiWrapper, bwcService} from '../../_wrapper/bitcore.wallet.client.api.wrapper';
import {StorageService} from '../storage/storage.service';

/**
 * Manages the profile data
 */
export interface IProfileService {

  /**
   * format
   * @param amount
   * @param asset
   * @param opts {dontRound: boolean, needToLocale: boolean}
   * @return formatted string
   */
  formatAmount(amount: any, asset: string, opts?: any): string;

  create(opts: any, cb?): Promise<any>;

  /**
   * why cb is needed, method is sync method
   * @param {string} walletId
   */
  setAndStoreFocus(walletId: string/*, cb*/): void;

  setWalletClients(): void;

  /**
   * think about cb
   * @param cb
   * @returns {any}
   */
  loadAndBindProfile(/*cb*/): Promise<any>;

  createWallet(opts: any, cb?): any;

  deleteWallet(opts: any, cb?): any;

  importWallet(str: string, opts, cb?): any;

  addWalletClient(walletClient: WalletClient, opts: any, cb?): any;

  importExtendedPrivateKey(xPrivKey: any, opts: any, cb?): any;

  // not used
  importMnemonic(words: any, opts: any, cb?): any;

  // not used
  importExtendedPublicKeyFunction (opts, cb): any;

  clearMnemonic(cb?): any;

  setPrivateKeyEncryptionFC(password: string, cb?): any;

  disablePrivateKeyEncryptionFC(cb?): any;

  lockFC(): void;

  unlockFC(error: any, cb?);

  insistUnlockFC(insistUnlockFCError: any, cb?): any;

  // TODO network never used in function ??
  getWallets(network: any): any;

  requestTouchid(cb): any;

  setSingleAddressFlag(newValue: any): any;

  replaceProfile(xPrivKey: any, mnemonic: string, myDeviceAddress: string, cb?): any;

  getWalletByAddress(address): Promise<any>;
}


const gettextCatalog =  {
  getString(key: string) {
    return key;
  }
};

const uxLanguage = {
  getCurrentLanguage() {
    return 'en';
  }
}

@Injectable()
export class ProfileService extends BaseService implements IProfileService {

  root: Root;

  constructor(private configService: ConfigService, private storageService: StorageService) {
    super();
    this.root = new Root();
  }

  formatAmount(amount: any, asset: string, opts?: any): string {
    const options = opts || { dontRound: true, needToLocale: asset !== 'DAG' };
    const config = this.configService.getSync().wallet.settings;
    // if (config.unitCode == 'byte') return amount;

    // TODO : now only works for english, specify opts to change thousand separator and decimal separator
    if (asset.toLowerCase() === 'dag') {
      // return this.Utils.formatAmount(amount, config.dagUnitCode, options);
      return '';
    }
    // return this.Utils.formatAmount(amount, config.unitCode, options);
    return '';
  }

  create(opts: any, cb?): Promise<any> {
    const defaults = this.configService.getDefaults();
    return this.configService.get()
      .then(value => this.createNewProfile(value))
      .then(value => this.bindProfile(value))
      .then(value => this.storageService.storeNewProfile(value));
  }

  setAndStoreFocus(walletId: string): void {
  }

  setWalletClients(): void {
  }

  loadAndBindProfile(): Promise<any> {
    return undefined;
  }

  createWallet(opts: any, cb?): any {
    return undefined;
  }

  deleteWallet(opts: any, cb?): any {
    return undefined;
  }

  importWallet(str: string, opts, cb?): any {
    return undefined;
  }

  addWalletClient(walletClient: WalletClient, opts: any, cb?): any {
    return undefined;
  }

  importExtendedPrivateKey(xPrivKey: any, opts: any, cb?): any {
    return undefined;
  }

  importMnemonic(words: any, opts: any, cb?): any {
    return undefined;
  }

  importExtendedPublicKeyFunction(opts, cb): any {
    return undefined;
  }

  // interface method, added here to show adding clearMnemonic method to Root class
  clearMnemonic(cb): any {
    this.root.clearMnemonic();
    return undefined;
  }

  setPrivateKeyEncryptionFC(password: string, cb?): any {
    return undefined;
  }

  disablePrivateKeyEncryptionFC(cb?): any {
    return undefined;
  }

  lockFC(): void {
  }

  unlockFC(error: any, cb?) {
  }

  insistUnlockFC(insistUnlockFCError: any, cb?): any {
    return undefined;
  }

  getWallets(network: any): any {
    return undefined;
  }

  requestTouchid(cb): any {
    return undefined;
  }

  setSingleAddressFlag(newValue: any): any {
    return undefined;
  }

  replaceProfile(xPrivKey: any, mnemonic: string, myDeviceAddress: string, cb?): any {
    return undefined;
  }

  getWalletByAddress(address): Promise<any> {
    return undefined;
  }

  private setFocus (walletId: string, cb?): void {
    throw new Error('not implemented');
  }

  private setWalletClient(credentials: any): void {
    throw new Error('not implemented');
  }

  private bindProfile(profile: Profile, cb?):  Promise<any> {
    // throw new Error('not implemented');
    return new Promise<any>(function (resolve, reject) {
      console.log('bind profile');
      resolve(profile);
    });
  }

  private seedWallet(opts: any, cb?): Promise<any> {
    const options = opts || {};
    const walletClient = bwcService.getClient(); // change bwcService
    const network = options.networkName || 'livenet';
    const $log = console;
    return new Promise(function (resolve, rej) {
      console.log('3.');
      let exception = null;
      if (options.mnemonic) {
        try {
          options.mnemonic = Utils.normalizeMnemonic(options.mnemonic);
          walletClient.seedFromMnemonic(options.mnemonic, {
            network,
            passphrase: options.passphrase,
            account: options.account || 0,
            derivationStrategy: options.derivationStrategy || 'BIP44',
          });
        } catch (ex) {
          exception = ex;
          $log.info(ex);
          // return cb(gettextCatalog.getString('Could not create: Invalid wallet seed'));
          rej({ex: ex, msg: gettextCatalog.getString('Could not create: Invalid wallet seed')});
        }
      } else if (options.extendedPrivateKey) {
        try {
          walletClient.seedFromExtendedPrivateKey(options.extendedPrivateKey, options.account || 0);
        } catch (ex) {
          exception = ex;
          $log.warn(ex);
          // return cb(gettextCatalog.getString('Could not create using the specified extended private key'));
          rej({ex: ex, msg: gettextCatalog.getString('Could not create using the specified extended private key')});
        }
      } else if (options.extendedPublicKey) {
        try {
          walletClient.seedFromExtendedPublicKey(options.extendedPublicKey, options.externalSource, options.entropySource, {
            account: options.account || 0,
            derivationStrategy: options.derivationStrategy || 'BIP44',
          });
        } catch (ex) {
          exception = ex;
          $log.warn('Creating wallet from Extended Public Key Arg:', ex, options);
          // return cb(gettextCatalog.getString('Could not create using the specified extended public key'));
          rej({ex: ex, msg: gettextCatalog.getString('Could not create using the specified extended public key')});
        }
      } else {
        const lang = uxLanguage.getCurrentLanguage();
        console.log(`will seedFromRandomWithMnemonic for language ${lang}`);
        try {
          walletClient.seedFromRandomWithMnemonic({
            network,
            passphrase: options.passphrase,
            language: lang,
            account: options.account || 0,
          });
        } catch (e) {
          $log.info(`Error creating seed: ${e.message}`);
          if (e.message.indexOf('language') > 0) {
            $log.info('Using default language for mnemonic');
            walletClient.seedFromRandomWithMnemonic({
              network,
              passphrase: options.passphrase,
              account: options.account || 0,
            });
          } else {
            exception = e;
            // return cb(e);
            rej({ex: e, msg: null});
          }
        }
      }
      if (exception == null) {
        resolve(walletClient);
      }
    });

  }

  private createNewProfile(opts: any, cb?): Promise<any> {
    const $self = this;
    console.log('2.');
    return this.seedWallet(opts)
      .then(walletClient => {
        console.log('4.');
        const config = $self.configService.getSync();
        const device = {genPrivKey() { return ''; }, getMyDeviceAddress() { }}; // require('byteballcore/device.js');
        const tempDeviceKey = device.genPrivKey();
        // walletClient.initDeviceProperties(walletClient.credentials.xPrivKey, null, config.hub, config.deviceName);
        const walletName = gettextCatalog.getString('Small Expenses Wallet');
        return {
          wc: walletClient,
          wn: walletName
        };
      })
      .then(wcn => Promise.resolve(BitcoreWalletClientApiWrapper.createWallet(wcn.wn, 1, 1, {network: 'livenet'})))
      .then(walletClient => {
        console.log('6.');
        const device = {genPrivKey() { return ''; }, getMyDeviceAddress() { }}; // require('byteballcore/device.js');
        console.log('created wallet, client:', walletClient);
        const xPrivKey = walletClient.credentials.xPrivKey;
        const mnemonic = walletClient.credentials.mnemonic;
        console.log(`mnemonic: ${mnemonic}`);
        const p = Profile.create({
          credentials: [JSON.parse(walletClient.export())],
          xPrivKey,
          mnemonic,
          tempDeviceKey: 'tempDeviceKey.toString(\'base64\')',
          my_device_address: device.getMyDeviceAddress(),
        });
        return p;
      })
      .catch(reason => {
        alert(reason);
      });
  }

  private setMetaData(walletClient, addressBook, cb?): any {
    throw new Error('not implemented');
  }

  private updateCredentialsFC(cb?): any {
    throw new Error('not implemented');
  }

  private saveTempKeys(tempDeviceKey: any, prevTempDeviceKey: any, onDone) {
    return function () {
      console.log('will save temp device keys'); // ,tempDeviceKey, prevTempDeviceKey);
      this.root.profile.tempDeviceKey = tempDeviceKey.toString('base64');
      if (prevTempDeviceKey) {
        this.root.profile.prevTempDeviceKey = prevTempDeviceKey.toString('base64');
      }
      console.log('tempDeviceKey: ' + tempDeviceKey);
      /*
      // TODO define storageService
      storageService.storeProfile(root.profile, (storeProfileError) => {
        onDone(storeProfileError);
      });
      */
    };
  }

  private unlockWalletAndInitDevice(): void {
    throw new Error('not implemented');
  }

}
