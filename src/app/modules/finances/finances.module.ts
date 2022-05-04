import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancesRoutingModule } from './finances-routing.module';
import { FinancesComponent } from './finances.component';
import { TaxesComponent } from './taxes/taxes.component';
import { TaxFormComponent } from './taxes/tax-form/tax-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PurchaseInvoicesComponent } from './purchase-invoices/purchase-invoices.component';
import { CreateInvoiceComponent } from './purchase-invoices/create-invoice-purchase/create-invoice.component';
import { ProviderNewDialog } from './purchase-invoices/provider-new.dialog/provider-new.dialog';
import { InvoiceConceptComponent } from './invoices/invoice-concept/invoice-concept.component';
import { SelectConceptDialogComponent } from './invoices/select-concept.dialog/select-concept.dialog.component';
import { ProductNewDialogComponent } from './purchase-invoices/product-new-dialog/product-new.dialog.component';
import { FooterInvoiceComponent } from './invoices/footer-invoice/footer-invoice.component';
import { TaxAmountCrudComponent } from './taxes/tax-amount-crud/tax-amount-crud.component';
import { InventoryModule } from '../inventory/inventory.module';
import { SalesInvoicesComponent } from './sales-invoices/sales-invoices.component';
import { CreateInvoiceSalesComponent } from './sales-invoices/create-invoice-sales/create-invoice-sales.component';
import { InvoiceConceptSalesComponent } from './sales-invoices/invoice-concept-sales/invoice-concept-sales.component';
import { SelectConceptSalesDialogComponent } from './sales-invoices/select-concept-sales-dialog/select-concept-sales-dialog.component';
import { StubsInvoiceComponent } from './stubs-invoice/stubs-invoice.component';
import { StubFormCreateComponent } from './stubs-invoice/stub-form/stub-form-create/stub-form-create.component';


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
    InvoiceConceptSalesComponent,
    SelectConceptSalesDialogComponent,
    StubsInvoiceComponent,
    StubFormCreateComponent
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
