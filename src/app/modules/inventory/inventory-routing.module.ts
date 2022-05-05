import { ProductCategoriesComponent } from './product-categories/product-categories.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { MesureUnitsComponent } from './mesure-units/mesure-units.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductsComponent } from './products/products.component';
import { ProviderComponent } from './providers/provider.component';
import { CountingsComponent } from './countings/countings.component';

const routes: Routes = [
  { path: 'products', component: ProductsComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'list' },
    { path: 'list', component: ProductListComponent },
    { path: 'categories', component: ProductCategoriesComponent} ,
    { path: 'countings', component: CountingsComponent },
    { path: 'measure_units', component: MesureUnitsComponent },
  ] },
  { path: 'providers', component: ProviderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
