import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericRegistFormComponent } from './generic-regist-form/generic-regist-form.component';
import { ChipsCrudComponent } from './chips-crud/chips-crud.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirebaseModule } from '../shared/firebase.module';
import { MaterialModule } from '../shared/material.module';
import { MarxaModule } from '../shared/marxa.module';
import { NgxMaskModule } from 'ngx-mask';
import { QrcodesCrudComponent } from './qrcodes-crud/qrcodes-crud.component';



@NgModule({
  declarations: [
    GenericRegistFormComponent,
    ChipsCrudComponent,
    QrcodesCrudComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FirebaseModule,
    MaterialModule,
    MarxaModule,
    NgxMaskModule
  ],
  exports: [
    GenericRegistFormComponent,
    ChipsCrudComponent,
    QrcodesCrudComponent,
  ]
})
export class ComponentsModule { }
