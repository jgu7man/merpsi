import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MxScannerDialog } from 'libs/@marxa/scanner/mx-scanner-dialog/mx-scanner.dialog';

@Component({
  selector: 'app-qrcodes-crud',
  templateUrl: './qrcodes-crud.component.html',
  styleUrls: ['./qrcodes-crud.component.scss']
})
export class QrcodesCrudComponent implements OnInit {

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  
  @Input() label: string = 'Códigos'
  @Input() instruction: string = 'Escribe o escanea códigos y después presiona COMA para que se agreguen a la lista'
  @Input() placeholder: string = 'Digita un código'
  @Input() codes: string[] = []
  @Output() codesChanged: EventEmitter<string[]> = new EventEmitter();

  constructor (
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  addQRCode(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.codes.push(value);
    }
    event.input.value = '';
    this.codesChanged.emit(this.codes)
  }

  removeQRCode(code: string): void {
    const index = this.codes.indexOf(code);

    if (index >= 0) {
      this.codes.splice(index, 1);
    }
    this.codesChanged.emit(this.codes)
  }

  openScanner() {
    this._dialog.open( MxScannerDialog, {
      maxWidth: '80%',
      data: {
        vwlargeSize: 25,
      }
    } ).afterClosed().subscribe( result => {
      if ( result ) {
        this.codes.push( result )
        this.codesChanged.emit(this.codes)
      }
    })
  }

}
