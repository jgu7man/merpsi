import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProviderComponent } from '../compras/provider/provider.component';

const routes: Routes = [
  { path: '', redirectTo: 'proveedores' },
  { path: 'proveedores', component: ProviderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
