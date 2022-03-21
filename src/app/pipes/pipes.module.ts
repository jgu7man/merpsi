import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsFormGroupPipe } from './as-form-group.pipe';
import { FormRawValuePipe } from './form-raw-value.pipe';



@NgModule({
  declarations: [
    AsFormGroupPipe,
    FormRawValuePipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AsFormGroupPipe,
    FormRawValuePipe
  ]
})
export class PipesModule { }
