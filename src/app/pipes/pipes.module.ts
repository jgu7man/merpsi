import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsFormGroupPipe } from './as-form-group.pipe';
import { FormRawValuePipe } from './form-raw-value.pipe';
import { DataPipe } from './data.pipe';
import { StorePipe } from './store.pipe';
import { IsCreditNotePipe } from './is-credit-note.pipe';
import { ContextCreditNotePipe } from './context-credit-note.pipe';



@NgModule({
  declarations: [
    AsFormGroupPipe,
    FormRawValuePipe,
    DataPipe,
    StorePipe,
    IsCreditNotePipe,
    ContextCreditNotePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AsFormGroupPipe,
    FormRawValuePipe,
    DataPipe,
    StorePipe,
    IsCreditNotePipe,
    ContextCreditNotePipe
  ]
})
export class PipesModule { }
