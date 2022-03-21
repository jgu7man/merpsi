import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MxScannerComponent } from './mx-scanner-component/mx-scanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MxScannerDialog } from './mx-scanner-dialog/mx-scanner.dialog';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { MaterialModule } from '../shared/material.module'
import { MxScannerButton } from './mx-scanner-button/mx-scanner.button';



@NgModule({
  declarations: [
    MxScannerComponent,
    MxScannerDialog,
    MxScannerButton
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    ZXingScannerModule,
    NgQrScannerModule
  ],
  exports: [
    MxScannerComponent,
    MxScannerDialog,
    MxScannerButton
  ],
  schemas: [
    
  ]
})
export class MxScannerModule { }
