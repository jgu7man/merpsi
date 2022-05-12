import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { PersonalComponent } from './managers/personal.component';
import { DeleteUsuarioDialog } from './managers/delete-usuario/delete-usuario.dialog';
import { SetUsuarioComponent } from './managers/set-usuario/set-usuario.component';
import { SedesComponent } from './stores/sedes.component';
import { SetSedeComponent } from './stores/set-sede/set-sede.component';
import { DeleteSedeDialog } from './stores/delete-sede/delete-sede.dialog';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    AdminComponent,
    PersonalComponent,
    DeleteUsuarioDialog,
    SetUsuarioComponent,
    SedesComponent,
    SetSedeComponent,
    DeleteSedeDialog,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],
})
export class AdminModule { }

