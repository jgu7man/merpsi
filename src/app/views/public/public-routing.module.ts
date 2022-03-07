import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelLoginComponent } from './components/panel-login/panel-login.component';
import { RegistComponent } from './components/regist/regist.component';

const routes: Routes = [
  { path: '', redirectTo: 'login'},
  { path: 'login', component: PanelLoginComponent },
  { path: 'registro', component: RegistComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
