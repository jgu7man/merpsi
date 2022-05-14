import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import { CheckoutPanelComponent } from './checkout-panel/checkout-panel.component';
import { ClientFormComponent, ClientFormDialog } from './client-form/client-form.component';
import { ProductViewerComponent } from './product-viewer/product-viewer.component';
import { ClientSearcherComponent } from './client-searcher/client-searcher.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScanProductBottom } from './scan-product/scan-product.bottom';


@NgModule({
  declarations: [
    CheckoutComponent,
    CheckoutPanelComponent,
    ClientFormComponent,
    ClientFormDialog,
    ProductViewerComponent,
    ClientSearcherComponent,
    ScanProductBottom,
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    SharedModule
  ]
})
export class CheckoutModule { }
