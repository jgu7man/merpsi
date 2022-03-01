import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelLoginComponent } from './components/panel-login/panel-login.component';

const routes: Routes = [
  { path: 'login', component: PanelLoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
