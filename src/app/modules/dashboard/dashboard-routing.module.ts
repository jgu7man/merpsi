import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
// { path: '', component: DashboardComponent },
{
  path: '',
  component: DashboardComponent,
  children: [
    { path: 'admin', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule) },
    { path: 'purchases', loadChildren: () => import( '../purchases/purchases.module' ).then(m => m.PurchasesModule ) },
    { path: 'inventory', loadChildren: () => import('../inventory/inventory.module').then(m => m.InventoryModule) },
    { path: 'sales', loadChildren: () => import('../sales/sales.module').then(m => m.SalesModule) },
    { path: 'clientes', loadChildren: () => import('../clients/clients.module').then(m => m.ClientsModule) },
    { path: 'finances', loadChildren: () => import('../finances/finances.module').then(m => m.FinancesModule) },
  ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
