import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { first, mergeMap } from 'rxjs/operators';
import { MxScannerDialog } from '../mx-scanner-dialog/mx-scanner.dialog';
import { MxScanner } from '../mx-scanner.service';

@Component({
  selector: 'mx-scanner-button',
  templateUrl: './mx-scanner.button.html',
  styleUrls: ['./mx-scanner.button.scss']
})
export class MxScannerButton implements OnInit {

  @Input() type: 'plain' | 'raised' | 'icon' = 'plain'
  @Input() label: string = 'Escanear'
  @Input() color?: ThemePalette
  @Output() result: EventEmitter<string> = new EventEmitter();

  constructor (
    private _dialog: MatDialog,
    private _scanner: MxScanner
  ) { 
    this._scanner.openScanner$.pipe(
    ).subscribe( () => {
      this.openScanner()
    })
  }

  ngOnInit(): void {
  }

  openScanner() {
    return this._dialog.open( MxScannerDialog, {
      maxWidth: '80%',
      data: {
        vwlargeSize: 25,
      }
    } ).afterClosed().pipe( first() ).subscribe( result => {
      this.result.emit(result)
    })
  }

}
