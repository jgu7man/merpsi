import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { ProductsComponent } from './products/products.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductFormComponent, ProductFormDialog } from './product-single/product-form/product-form.component';
import { ProductStorageComponent } from './product-single/product-storage/product-storage.component';
import { ProductSingleComponent } from './product-single/product-single.component';
import { ProductStoredFormComponent } from './product-single/product-stored-form/product-stored-form.component';
import { MesureUnitsComponent } from './mesure-units/mesure-units.component';
import { MesureUnitFormComponent } from './mesure-units/mesure-unit-form/mesure-unit-form.component';
import { MesureUnitSelectorComponent } from './mesure-units/mesure-unit-selector/mesure-unit-selector.component';
import { ProviderComponent } from './providers/provider.component';
import { SetProviderComponent } from './providers/set-provider/set-provider.component';
import { ProviderSelectorComponent } from './providers/provider-selector/provider-selector.component';


@NgModule({
  declarations: [
    InventoryComponent,
    ProductsComponent,
    ProductFormComponent,
    ProductFormDialog,
    ProductStorageComponent,
    ProductSingleComponent,
    ProductStoredFormComponent,
    MesureUnitsComponent,
    MesureUnitFormComponent,
    MesureUnitSelectorComponent,
    ProviderComponent,
    SetProviderComponent,
    ProviderSelectorComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    SharedModule,
  ],
  exports: [
    SetProviderComponent,
    ProductFormComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class InventoryModule { }
