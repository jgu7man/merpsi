import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericRegistFormComponent } from './generic-regist-form/generic-regist-form.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    GenericRegistFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    GenericRegistFormComponent
  ]
})
export class ComponentsModule { }
