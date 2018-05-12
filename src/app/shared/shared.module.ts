import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { NetworkService } from './network.service';
import { NetworkSwitchComponent } from './network-switch/network-switch.component';

const COMPONENTS = [NetworkSwitchComponent];

@NgModule({
  imports: [CommonModule, MaterialModule],
  providers: [NetworkService],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class SharedModule {}
