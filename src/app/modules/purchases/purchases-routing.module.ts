import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProviderComponent} from '../purchases/provider/provider.component';
import { PurchaseInvoicesComponent } from './purchase-invoices/purchase-invoices.component';

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
