import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProviderComponent } from '../inventory/providers/provider.component';
import { PersonalComponent } from './managers/personal.component';
import { SedesComponent } from './stores/sedes.component';

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
