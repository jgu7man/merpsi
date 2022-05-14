import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutPanelComponent } from './checkout-panel/checkout-panel.component';
import { CheckoutComponent } from './checkout.component';

const routes: Routes = [
  { path: '', component: CheckoutComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'panel' },
    { path: 'panel', component: CheckoutPanelComponent },
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
