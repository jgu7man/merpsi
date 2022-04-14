import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancesRoutingModule } from './finances-routing.module';
import { FinancesComponent } from './finances.component';
import { TaxesComponent } from './taxes/taxes.component';
import { TaxFormComponent } from './taxes/tax-form/tax-form.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    FinancesComponent,
    TaxesComponent,
    TaxFormComponent,
  ],
  imports: [
    CommonModule,
    FinancesRoutingModule,
    SharedModule
  ],
  exports: [
    // TaxesCrudComponent
  ]
})
export class FinancesModule { }
