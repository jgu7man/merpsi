import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminRoutingModule} from './purchases-routing.module';
import {SharedModule} from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],
  schemas: [
     CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PurchasesModule { }
