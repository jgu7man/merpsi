import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients.component';
import { SetClientComponent } from './set-client/set-client.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeleteClientComponent } from './delete-client/delete-client.component';
import { ClientFormComponent, ClientFormDialog } from './client-form/client-form.component';
import { ClientAddressFormComponent } from './client-address-form/client-address-form.component';


@NgModule({
  declarations: [
    ClientsComponent,
    SetClientComponent,
    DeleteClientComponent,
    ClientFormComponent,
    ClientFormDialog,
    ClientAddressFormComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    SharedModule
  ]
})
export class ClientsModule { }
