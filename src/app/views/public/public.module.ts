import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public.component';
import { PanelLoginComponent } from './components/panel-login/panel-login.component';
import { RegistComponent } from './components/regist/regist.component';
import { SharedModule } from 'shared/shared.module';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    PublicComponent,
    PanelLoginComponent,
    RegistComponent,
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    SharedModule,
    ComponentsModule
  ]
})
export class PublicModule { }
