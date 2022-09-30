import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FormControl } from '@angular/forms';
import { MxScannerComponent } from 'libs/@marxa/scanner/mx-scanner-component/mx-scanner.component';
import { MxLoading } from '@marxa/devkit';

@Component({
  templateUrl: './scan-product.bottom.html',
  styleUrls: ['./scan-product.bottom.scss']
})
export class ScanProductBottom implements OnInit {

  @ViewChild('scanner') scanner!: MxScannerComponent;
  @ViewChild('productInput') productInput!: ElementRef
  byScanner: boolean = true
  productoCtrl: FormControl = new FormControl()

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ScanProductBottom>,
    private _loading: MxLoading
  ) { }

  ngOnInit(): void {
  }

  onScanned(result: any) {
    this._bottomSheetRef.dismiss(result)
  }

  async toggleScanner() {
    if (this.byScanner) {
      this.scanner.turnOff()
    }
    this.byScanner = !this.byScanner
    await this._loading.waitFor(100)
    if (!this.byScanner) {
      this.productInput.nativeElement.focus()
    }
  }

}
