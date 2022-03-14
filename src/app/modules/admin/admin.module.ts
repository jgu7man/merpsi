import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { PersonalComponent } from './personal/personal.component';
import { DeleteUsuarioDialog } from './personal/delete-usuario/delete-usuario.dialog';
import { SetUsuarioComponent } from './personal/set-usuario/set-usuario.component';
import { SedesComponent } from './sedes/sedes.component';
import { SetSedeComponent } from './sedes/set-sede/set-sede.component';
import { DeleteSedeDialog } from './sedes/delete-sede/delete-sede.dialog';


@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
