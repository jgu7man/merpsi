import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsFormGroupPipe } from './as-form-group.pipe';
import { FormRawValuePipe } from './form-raw-value.pipe';
import { DataPipe } from './data.pipe';
import { StorePipe } from './store.pipe';



@NgModule({
  declarations: [
    AsFormGroupPipe,
    FormRawValuePipe,
    DataPipe,
    StorePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AsFormGroupPipe,
    FormRawValuePipe,
    DataPipe,
    StorePipe
  ]
})
export class PipesModule { }
