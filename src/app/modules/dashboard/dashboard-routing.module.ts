import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
// { path: '', redirectTo: 'empresa' },
{ path: '', component: DashboardComponent },
{
  path: ':eid',
  component: DashboardComponent,
  children: [
    { path: 'admin', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule) },
  ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
