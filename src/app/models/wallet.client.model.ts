import {Credentials} from './credentials.model';

export class WalletClient {

  credentials: Credentials;

  constructor() {
    this.credentials = new Credentials();
  }

  public clearMnemonic() {
    throw new Error('not implemented - WalletClient');
  }

}
