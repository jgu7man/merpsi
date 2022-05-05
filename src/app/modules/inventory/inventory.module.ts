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
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductCategoriesComponent } from './product-categories/product-categories.component';
import { ProductCategoryFormComponent } from './product-categories/product-category-form/product-category-form.component';
import { ProductSubcategoryFormComponent } from './product-categories/product-subcategory-form/product-subcategory-form.component';
import { ProductCategorySelectorComponent } from './product-categories/product-category-selector/product-category-selector.component';
import { SubcategoryValuePipe } from './product-categories/subcategory-value.pipe';
import { CountingsComponent } from './countings/countings.component';
import { CountingInitializationDialog } from './countings/counting-initialization/counting-initialization.dialog';
import { CountingReportComponent } from './countings/counting-report/counting-report.component';


@NgModule({
  declarations: [
    InventoryComponent,
    MesureUnitFormComponent,
    MesureUnitSelectorComponent,
    MesureUnitsComponent,
    ProductFormComponent,
    ProductFormDialog,
    ProductListComponent,
    ProductSingleComponent,
    ProductStorageComponent,
    ProductStoredFormComponent,
    ProductsComponent,
    ProviderComponent,
    ProviderSelectorComponent,
    SetProviderComponent,
    ProductCategoriesComponent,
    ProductCategoryFormComponent,
    ProductSubcategoryFormComponent,
    ProductCategorySelectorComponent,
    SubcategoryValuePipe,
    CountingsComponent,
    CountingReportComponent,
    CountingInitializationDialog,
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    SharedModule,
  ],
  exports: [
    ProviderSelectorComponent,
    SetProviderComponent,
    ProductFormComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class InventoryModule { }
