import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancesRoutingModule } from './finances-routing.module';
import { FinancesComponent } from './finances.component';
import { TaxesComponent } from './taxes/taxes.component';
import { TaxFormComponent } from './taxes/tax-form/tax-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PurchaseInvoicesComponent } from './purchase-invoices/purchase-invoices.component';
import { CreateInvoiceComponent } from './invoices/create-invoice.component';
import { ProviderNewDialog } from './purchase-invoices/provider-new.dialog/provider-new.dialog';
import { InvoiceConceptComponent } from './invoices/invoice-concept/invoice-concept.component';
import { SelectConceptDialogComponent } from './invoices/select-concept.dialog/select-concept.dialog.component';
import { ProductNewDialogComponent } from './purchase-invoices/product-new-dialog/product-new.dialog.component';
import { FooterInvoiceComponent } from './invoices/footer-invoice/footer-invoice.component';
import { TaxAmountCrudComponent } from './taxes/tax-amount-crud/tax-amount-crud.component';
import { InventoryModule } from '../inventory/inventory.module';
import { SalesInvoicesComponent } from './sales-invoices/sales-invoices.component';
import { CreateInvoiceSalesComponent } from './sales-invoices/create-invoice-sales/create-invoice-sales.component';
import { AddConceptComponent } from './sales-invoices/create-invoice-sales/add-concept/add-concept.component';


@NgModule({
  declarations: [
    FinancesComponent,
    TaxesComponent,
    TaxFormComponent,
    PurchaseInvoicesComponent,
    CreateInvoiceComponent,
    ProviderNewDialog,
    InvoiceConceptComponent,
    SelectConceptDialogComponent,
    ProductNewDialogComponent,
    FooterInvoiceComponent,
    TaxAmountCrudComponent,
    SalesInvoicesComponent,
    CreateInvoiceSalesComponent,
    AddConceptComponent
  ],
  imports: [
    CommonModule,
    FinancesRoutingModule,
    SharedModule,
    InventoryModule
  ],
  exports: [
    // TaxesCrudComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class FinancesModule { }
