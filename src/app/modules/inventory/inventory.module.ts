import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { ProductsComponent } from './products/products.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductFormComponent } from './product-single/product-form/product-form.component';
import { ProductStorageComponent } from './product-single/product-storage/product-storage.component';
import { ProductSingleComponent } from './product-single/product-single.component';
import { ProductStoredFormComponent } from './product-single/product-stored-form/product-stored-form.component';


@NgModule({
  declarations: [
    InventoryComponent,
    ProductsComponent,
    ProductFormComponent,
    ProductStorageComponent,
    ProductSingleComponent,
    ProductStoredFormComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    SharedModule,
  ]
})
export class InventoryModule { }
