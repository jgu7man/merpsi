import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { MesureUnitsComponent } from './mesure-units/mesure-units.component';
import { ProductsComponent } from './products/products.component';
import { ProviderComponent } from './providers/provider.component';

const routes: Routes = [
  { path: 'products', component: ProductsComponent },
  { path: 'mesure-units', component: MesureUnitsComponent },
  { path: 'providers', component: ProviderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
