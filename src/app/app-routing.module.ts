import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelLoginComponent } from './views/public/components/panel-login/panel-login.component';
import { RegistComponent } from './views/public/components/regist/regist.component';

const routes: Routes = [
  { path: 'login', component: PanelLoginComponent },
  { path: 'registro', component: RegistComponent },
  { path: 'public', loadChildren: () => import('./views/public/public.module').then(m => m.PublicModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
