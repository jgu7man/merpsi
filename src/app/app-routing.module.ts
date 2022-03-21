import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/public/public.module').then(m => m.PublicModule) },
  { path: 'business/:eid', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
