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
import { InvoiceDetailsComponent } from './shared/invoice-details/invoice-details.component';
import { SelectConceptDialogComponent } from './shared/select-concept.dialog/select-concept.dialog.component';
import { ProductNewDialogComponent } from './purchase-invoices/product-new-dialog/product-new.dialog.component';
import { TaxAmountCrudComponent } from './taxes/tax-amount-crud/tax-amount-crud.component';
import { InventoryModule } from '../inventory/inventory.module';
import { SalesInvoicesComponent } from './sales-invoices/sales-invoices.component';
import { CreateInvoiceSalesComponent } from './sales-invoices/create-invoice-sales/create-invoice-sales.component';
import { InvoiceConceptSalesComponent } from './sales-invoices/invoice-concept-sales/invoice-concept-sales.component';
import { SelectConceptSalesDialogComponent } from './sales-invoices/select-concept-sales-dialog/select-concept-sales-dialog.component';
import { StubsInvoiceComponent } from './stubs-invoice/stubs-invoice.component';
import { StubFormCreateComponent } from './stubs-invoice/stub-form/stub-form-create/stub-form-create.component';
import { CreditNoteComponent } from './credit-note/credit-note.component';
import { CreditDebitNoteDialogComponent } from './sales-invoices/create-invoice-sales/credit-debit-note.dialog/credit-debit-note.dialog.component';
import { TestFinanceComponent } from './test-finance/test-finance.component';
import { SelectConceptCreditComponent } from './sales-invoices/create-invoice-sales/credit-debit-note.dialog/select-concept-credit/select-concept-credit.component';
import { DebitNoteComponent } from './debit-note/debit-note.component';
import { CreateDebitNoteComponent } from './debit-note/create-debit-note/create-debit-note.component';
import { FooterCreditoDebitoComponent } from './shared/footer-note/footer-notes.component';
import { SelectPuchaseComponent } from './purchase-invoices/select-puchase/select-puchase.component';
import { LinkedDocumentsComponent } from './sales-invoices/linked-documents/linked-documents.component';
import { SelectCreditNoteComponent } from './credit-note/select-credit-note/select-credit-note.component';
import { SelectDocumentDialogComponent } from './sales-invoices/linked-documents/select-document.dialog/select-document.dialog.component';
import { SelectDebitNoteComponent } from './debit-note/select-debit-note/select-debit-note.component';
import { FormCreditNoteComponent } from './credit-note/form-credit-note/form-credit-note.component';
import { FooterInvoiceComponent } from './shared/footer-invoice/footer-invoice.component';


@NgModule({
  declarations: [
    FinancesComponent,
    TaxesComponent,
    TaxFormComponent,
    PurchaseInvoicesComponent,
    CreateInvoiceComponent,
    ProviderNewDialog,
    InvoiceDetailsComponent,
    SelectConceptDialogComponent,
    ProductNewDialogComponent,
    FooterInvoiceComponent,
    TaxAmountCrudComponent,
    SalesInvoicesComponent,
    CreateInvoiceSalesComponent,
    InvoiceConceptSalesComponent,
    SelectConceptSalesDialogComponent,
    StubsInvoiceComponent,
    StubFormCreateComponent,
    CreditNoteComponent,
    FormCreditNoteComponent,
    CreditDebitNoteDialogComponent,
    TestFinanceComponent,
    SelectConceptCreditComponent,
    DebitNoteComponent,
    CreateDebitNoteComponent,
    FooterCreditoDebitoComponent,
    SelectPuchaseComponent,
    LinkedDocumentsComponent,
    SelectCreditNoteComponent,
    SelectDocumentDialogComponent,
    SelectDebitNoteComponent
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
