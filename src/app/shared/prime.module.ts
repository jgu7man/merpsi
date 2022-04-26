import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// MODULES
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { SidebarModule } from 'primeng/sidebar';
import {TreeTableModule} from 'primeng/treetable';
import {TreeSelectModule} from 'primeng/treeselect';

// SERVICES
import {
  ConfirmationService,
  PrimeIcons
} from 'primeng/api';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    ConfirmPopupModule,
    SidebarModule,
    TreeTableModule,
    TreeSelectModule
  ],
  providers: [
    ConfirmationService,
    PrimeIcons
  ]
})
export class PrimeModule { }
