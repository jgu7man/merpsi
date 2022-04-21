import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirebaseModule } from './firebase.module';
import { MaterialModule } from './material.module';
import { MarxaModule } from './marxa.module';
import { NgxMaskModule } from 'ngx-mask';
import { PipesModule } from '../pipes/pipes.module';
import { ComponentsModule } from '../components/components.module';
import { PrimeModule } from './prime.module';



@NgModule( {
  exports: [
    ReactiveFormsModule,
    FormsModule,
    FirebaseModule,
    MaterialModule,
    MarxaModule,
    NgxMaskModule,
    PipesModule,
    ComponentsModule,
    PrimeModule
  ],
  imports: [
    PipesModule,
    MarxaModule
  ]
})
export class SharedModule { }
