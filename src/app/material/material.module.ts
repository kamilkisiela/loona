import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatInputModule,
  MatListModule,
  MatSlideToggleModule,
} from '@angular/material';

@NgModule({
  imports: [CommonModule],
  exports: [MatInputModule, MatListModule, MatSlideToggleModule],
  declarations: [],
})
export class MaterialModule {}
