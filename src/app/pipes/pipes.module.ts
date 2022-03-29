import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsFormGroupPipe } from './as-form-group.pipe';
import { FormRawValuePipe } from './form-raw-value.pipe';
import { DataPipe } from './data.pipe';



@NgModule({
  declarations: [
    AsFormGroupPipe,
    FormRawValuePipe,
    DataPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AsFormGroupPipe,
    FormRawValuePipe,
    DataPipe
  ]
})
export class PipesModule { }
