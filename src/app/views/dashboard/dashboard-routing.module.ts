import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { PersonalComponent } from './personal/personal.component';
import { SedesComponent } from './sedes/sedes.component';

const routes: Routes = [
{ path: '', redirectTo: 'empresa' },
{ path: 'empresa', component: DashboardComponent },
{
  path: 'empresa/:id',
  component: DashboardComponent,
  children: [
    { path: 'admin/personal', component: PersonalComponent },
    { path: 'admin/sedes', component: SedesComponent },
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
