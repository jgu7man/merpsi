import { EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { iUploadedFile } from '@marxa/storage';
import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { iSede, SedeModel } from '../sede.model';
import { SedesService } from '../sedes.service';

@Component({
  selector: 'app-set-sede',
  templateUrl: './set-sede.component.html',
  styleUrls: ['./set-sede.component.scss']
})
export class SetSedeComponent implements OnInit, OnDestroy{

  private _sede: BehaviorSubject<iSede> = new BehaviorSubject(new SedeModel('','','',''));
  @Input() set sede(suc: iSede) { this._sede.next(suc); }
  get sede() { return this._sede.getValue() }

  sedeForm: FormGroup = new FormGroup( {
    name: new FormControl( '', [ Validators.required ]),
    referencia: new FormControl( '' ),
    tipo: new FormControl( '' ),
    direccion: new FormControl( ''),
    ciudad: new FormControl( ''),
    depto: new FormControl( ''),
    linkmap: new FormControl( ''),
  })

  private dataSubscription!: Subscription
  @Output() saved: EventEmitter<any> = new EventEmitter()

  constructor(
    private _sedes: SedesService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.dataSubscription =
    this._sede.pipe(distinctUntilChanged()).subscribe(data => {
      if(data) this.sedeForm.patchValue(data)
    })
  }

  onPanoramicaLoaded( files: iUploadedFile[] ) {
    this.sedeForm.patchValue( { panoramica: files[ 0 ].url } )
    this._dialog.closeAll()
    this.sedeForm.markAsDirty()
  }


  async onSubmit() {
    this.sede = {...this.sede, ...this.sedeForm.getRawValue()}
    await this._sedes.save(this.sede)
    this.sedeForm.patchValue({
      referencia: '',
      tipo: '',
      direccion: '',
      ciudad: '',
      depto: '',
      linkmap: '',
    })
    this.saved.emit()
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe()
  }

}
