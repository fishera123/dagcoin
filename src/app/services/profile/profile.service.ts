import {Injectable} from '@angular/core';
import {Root} from '../../models/root.model';
import {Profile} from '../../models/profile.model';
import {WalletClient} from '../../models/wallet.client.model';
import {debug} from 'util';

/**
 * Manages the profile data
 */
export interface IProfileService {

  /**
   * format
   * @param amount
   * @param asset
   * @param opts
   */
  formatAmount(amount: any, asset: any, opts?: any): string;

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

@Injectable()
export class ProfileService implements IProfileService {

  root: Root;

  constructor() {
    this.root = new Root();
  }

  formatAmount(amount: any, asset: any, opts?: any): string {
    return undefined;
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

  private bindProfile(profile: Profile, cb?): void {
    throw new Error('not implemented');
  }

  private seedWallet(opts: any, cb?): any {
    throw new Error('not implemented');
  }

  private createNewProfile(opts: any, cb?): any {
    throw new Error('not implemented');
  }

  private setMetaData(walletClient, addressBook, cb?): any {
    throw new Error('not implemented');
  }

  // maps root.create, must be in interface??
  private create(opts: any, cb?): any {
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
