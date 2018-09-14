import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';

import {SubmitFormComponent} from './submit-form.component';
import {ListComponent} from './list.component';

const DECLARATIONS = [SubmitFormComponent, ListComponent];

@NgModule({
  declarations: DECLARATIONS,
  exports: [...DECLARATIONS],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [],
})
export class SharedModule {}
