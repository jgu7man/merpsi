import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderComponent } from './provider/provider.component';
import { SharedModule } from 'shared/shared.module';
import { AdminRoutingModule } from './compras-routing.module';
<<<<<<< HEAD
=======
import { SetProviderComponent } from './provider/set-provider/set-provider.component';
>>>>>>> mari



@NgModule({
  declarations: [
<<<<<<< HEAD
    ProviderComponent
=======
    ProviderComponent,
    SetProviderComponent
>>>>>>> mari
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class ComprasModule { }
