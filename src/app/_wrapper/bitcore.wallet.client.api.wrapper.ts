import {delay} from 'q';

export const bwcService = {
  getClient() {
    return {
      async createWallet(walletName, m, n, opts, cb) {
        console.log('bwcService. create wallet started');
        await delay(3124);
        console.log('bwcService. create wallet result ok');
        cb();
      },
      seedFromMnemonic(str, opts) {
        return '';
      },
      seedFromExtendedPublicKey(p1, p2, p3, p4) {
        return '';
      },
      seedFromRandomWithMnemonic(p1) {
        return '';
      },
      seedFromExtendedPrivateKey(p1, p2) {
        return '';
      }
    };
  }
};

/**
 * Promisify the bitcore client api methods
 */
export class BitcoreWalletClientApiWrapper {

  public static createWallet(walletName, m, n, opts): Promise<any> {
    return new Promise((resolve, reject) => {
      bwcService.getClient().createWallet(walletName, m, n, opts, (err) => {
        console.log('5.');
        console.log('BitcoreWalletClientApiWrapper .... ');
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

}
