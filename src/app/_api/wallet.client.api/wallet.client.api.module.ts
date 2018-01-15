import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BwcService } from './bwc.service';
import {API} from './wallet-client/lib/api';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [BwcService, API],
  declarations: []
})
export class WalletClientApiModule {

}
