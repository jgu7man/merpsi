import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MesureUnitModel, MesureUnit } from 'src/app/modules/inventory/mesure-units/mesure-unit.model';
import { MesureUnitsService } from '../mesure-units.service';


@Component({
  selector: 'app-mesure-unit-form',
  templateUrl: './mesure-unit-form.component.html',
  styleUrls: ['./mesure-unit-form.component.scss']
})
export class MesureUnitFormComponent implements OnInit {

  @Input() value?: MesureUnitModel
  public mesureUnitForm: MesureUnit.form

  constructor (
    private _mesureUnits: MesureUnitsService
  ) { 
    this.mesureUnitForm = new FormGroup( {
      name: new FormControl( '', [ Validators.required ] ),
      description: new FormControl( '' ),
      symbol: new FormControl('', ),
      singular: new FormControl( '' ),
      plural: new FormControl( '' ),
      zero: new FormControl( '' )
    }) as MesureUnit.form
  }

  ngOnInit(): void {
    if ( this.value ) {
      this.mesureUnitForm.patchValue({...this.value})
    }
  }

  onSubmit() {
    this.mesureUnitForm.markAsPristine()
    if ( this.value ) {
      this._mesureUnits.update( {
        ...this.mesureUnitForm.getRawValue(),
        index: this.value.index
      } )
    } else {
      this._mesureUnits.add( this.mesureUnitForm.value )
    }
    
  }
}

