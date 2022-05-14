import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
// { path: '', component: DashboardComponent },
{
  path: '',
  component: DashboardComponent,
  children: [
    { path: 'admin', loadChildren: () => import('../modules/admin/admin.module').then(m => m.AdminModule) },
    { path: 'inventory', loadChildren: () => import('../modules/inventory/inventory.module').then(m => m.InventoryModule) },
    { path: 'clientes', loadChildren: () => import('../modules/clients/clients.module').then(m => m.ClientsModule) },
    { path: 'finances', loadChildren: () => import( '../modules/finances/finances.module' ).then( m => m.FinancesModule ) },
    { path: 'checkout', loadChildren: () => import('../modules/checkout/checkout.module').then(m => m.CheckoutModule) },
  ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
