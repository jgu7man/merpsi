import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditNoteComponent } from './credit-note/credit-note.component';
import { FormCreditNoteComponent } from './credit-note/form-credit-note/form-credit-note.component';
import { SelectCreditNoteComponent } from './credit-note/select-credit-note/select-credit-note.component';
import { CreateDebitNoteComponent } from './debit-note/create-debit-note/create-debit-note.component';
import { DebitNoteComponent } from './debit-note/debit-note.component';
import { FinancesComponent } from './finances.component';
import { PurchaseInvoicesComponent } from './purchase-invoices/purchase-invoices.component';
import { SalesInvoicesComponent } from './sales-invoices/sales-invoices.component';
import { StubsInvoiceComponent } from './stubs-invoice/stubs-invoice.component';
import { TaxesComponent } from './taxes/taxes.component';

const routes: Routes = [
  { path: '', component: FinancesComponent },
  { path: 'taxes', component: TaxesComponent },
  { path: 'purchases', component: PurchaseInvoicesComponent },
  { path: 'sales', component: SalesInvoicesComponent },
  { path: 'credit-notes', component: CreditNoteComponent },
  { path: 'debit-notes', component: DebitNoteComponent },
  { path: 'new-credit-notes/:tipo/:invoiceId', component: FormCreditNoteComponent },
  { path: 'credit-notes/:id', component: SelectCreditNoteComponent },
  { path: 'new-debit-notes/:invoiceId', component: CreateDebitNoteComponent },
  { path: 'stubs', component: StubsInvoiceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancesRoutingModule { }
