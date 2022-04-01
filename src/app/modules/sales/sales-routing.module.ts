import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesInvoicesComponent } from './sales-invoices/sales-invoices.component';
import { SalesComponent } from './sales.component';

const routes: Routes = [{ path: '', component: SalesComponent },
                        { path: 'facturas', component: SalesInvoicesComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
