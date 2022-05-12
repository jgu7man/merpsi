import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material.module';
import { FirebaseModule } from 'src/app/shared/firebase.module';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreSelector } from '../stores/store-selector/store.selector';



@NgModule({
  declarations: [
    StoreSelector
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FirebaseModule,
    ReactiveFormsModule,
  ],
  exports: [
    StoreSelector
  ]
})
export class SharedAdminModule { }
