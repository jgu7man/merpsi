import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProviderComponent} from './provider/provider.component';
import {AdminRoutingModule} from './purchases-routing.module';
import {SetProviderComponent} from './provider/set-provider/set-provider.component';
import {SharedModule} from 'src/app/shared/shared.module';
import { PurchaseInvoicesComponent } from './purchase-invoices/purchase-invoices.component';
import { CreateInvoiceComponent } from './purchase-invoices/create-invoice/create-invoice.component';
import { ProviderNewDialog } from './purchase-invoices/provider-new.dialog/provider-new.dialog';
import { InvoiceConceptComponent } from './purchase-invoices/create-invoice/invoice-concept/invoice-concept.component';
import { SelectConceptDialogComponent } from './purchase-invoices/create-invoice/select-concept.dialog/select-concept.dialog.component';


@NgModule({
  declarations: [
    ProviderComponent,
    SetProviderComponent,
    PurchaseInvoicesComponent,
    CreateInvoiceComponent,
    ProviderNewDialog,
    InvoiceConceptComponent,
    SelectConceptDialogComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],
  schemas: [
    // CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PurchasesModule { }
