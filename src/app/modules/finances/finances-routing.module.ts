import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancesComponent } from './finances.component';
import { TaxesComponent } from './taxes/taxes.component';

const routes: Routes = [
  { path: '', component: FinancesComponent },
  { path: 'taxes', component: TaxesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancesRoutingModule { }
