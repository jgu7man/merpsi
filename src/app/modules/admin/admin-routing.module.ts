import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalComponent } from './personal/personal.component';
import { SedesComponent } from '../sedes/sedes.component';

const routes: Routes = [
  { path: '', redirectTo: 'personal' },
  { path: 'personal', component: PersonalComponent },
  { path: 'sedes', component: SedesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
