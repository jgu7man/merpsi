import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'shared/shared.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PersonalComponent } from './personal/personal.component';
import { DeleteUsuarioDialog } from './personal/delete-usuario/delete-usuario.dialog';
import { SetUsuarioComponent } from './personal/set-usuario/set-usuario.component';
import { SedesComponent } from './sedes/sedes.component';
import { SetSedeComponent } from './sedes/set-sede/set-sede.component';
import { DeleteSedeDialog } from './sedes/delete-sede/delete-sede.dialog';


@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent,
    PersonalComponent,
    DeleteUsuarioDialog,
    SetUsuarioComponent,
    SedesComponent,
    SetSedeComponent,
    DeleteSedeDialog
    
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
