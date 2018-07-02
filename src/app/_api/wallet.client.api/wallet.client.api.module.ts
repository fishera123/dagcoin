import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BwcService} from './bwc.service';
import {APIs} from './wallet-client/lib/api';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [BwcService, APIs],
  declarations: []
})
export class WalletClientApiModule {

}
