import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients.component';
import { SetClientComponent } from './set-client/set-client.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ClientsComponent,
    SetClientComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    SharedModule
  ]
})
export class ClientsModule { }
