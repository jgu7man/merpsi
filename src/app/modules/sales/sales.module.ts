import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { SalesInvoicesComponent } from './sales-invoices/sales-invoices.component';
import { CreateInvoiceSalesComponent } from './sales-invoices/create-invoice-sales/create-invoice-sales.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddConceptComponent } from './sales-invoices/create-invoice-sales/add-concept/add-concept.component';


@NgModule({
  declarations: [
    SalesComponent,
    SalesInvoicesComponent,
    CreateInvoiceSalesComponent,
    AddConceptComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    SharedModule
  ],
  schemas: [
     CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SalesModule { }
