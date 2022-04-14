import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { PurchaseInvoicesComponent } from '../finances/purchase-invoices/purchase-invoices.component';
import {ProviderComponent} from '../inventory/providers/provider.component';

const routes: Routes = [
  { path: '', redirectTo: 'proveedores' },
  { path: 'proveedores', component: ProviderComponent },
  { path: 'facturas', component: PurchaseInvoicesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
