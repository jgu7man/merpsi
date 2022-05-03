import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
  { path: 'stubs', component: StubsInvoiceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancesRoutingModule { }
