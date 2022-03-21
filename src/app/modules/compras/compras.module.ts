import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderComponent } from './provider/provider.component';
import { AdminRoutingModule } from './compras-routing.module';
import { SetProviderComponent } from './provider/set-provider/set-provider.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ProviderComponent,
    SetProviderComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class ComprasModule { }
