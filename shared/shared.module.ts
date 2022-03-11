import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirebaseModule } from './firebase.module';
import { MaterialModule } from './material.module';
import { MarxaModule } from './marxa.module';
import { MxCrudPanelModule } from '@marxa/crud-panel';



@NgModule( {
  exports: [
    ReactiveFormsModule,
    FormsModule,
    FirebaseModule,
    MaterialModule,
    MarxaModule
  ]
})
export class SharedModule { }
