import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { ProductsComponent } from './products/products.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewProductoComponent } from './products/view-producto/view-producto.component';
import { ProductFormComponent } from './products/product-form/product-form.component';


@NgModule({
  declarations: [
    InventoryComponent,
    ProductsComponent,
    ViewProductoComponent,
    ProductFormComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    SharedModule
  ]
})
export class InventoryModule { }
