import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { SalesInvoicesComponent } from './sales-invoices/sales-invoices.component';
import { CreateInvoiceSalesComponent } from './sales-invoices/create-invoice-sales/create-invoice-sales.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SalesComponent,
    SalesInvoicesComponent,
    CreateInvoiceSalesComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    SharedModule
  ]
})
export class SalesModule { }
