import {Profile} from './profile.model';
import {WalletClient} from './wallet.client.model';

export class Root {
  profile?: Profile;
  focusedClient?: any;
  walletClients?: Array<WalletClient> = [];

  constructor() {
    this.profile = new Profile();
  }

  // TODO any must be a class map to client
  public getClient(walletId: string): any {
    return this.walletClients[walletId];
  }

  public clearMnemonic() {
    delete this.profile.mnemonic;
    delete this.profile.mnemonicEncrypted;
    Object.keys(this.walletClients).forEach((wid) => {
      this.walletClients[wid].clearMnemonic(); // TODO use getter method
    });
  }

}
