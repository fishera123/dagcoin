import {Credentials} from '../_api/wallet.client.api/wallet-client/lib/credentials';

export class WalletClient {

  credentials: Credentials;

  constructor() {
    this.credentials = new Credentials();
  }

  public clearMnemonic() {
    throw new Error('not implemented - WalletClient');
  }

}
