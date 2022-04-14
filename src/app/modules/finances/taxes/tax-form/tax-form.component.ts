import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tax, TaxModel } from '../taxes.model';
import { TaxesService } from '../taxes.service';

@Component({
  selector: 'app-tax-form',
  templateUrl: './tax-form.component.html',
  styleUrls: ['./tax-form.component.scss']
})
export class TaxFormComponent implements OnInit {

  @Input() value?: TaxModel

  public taxForm: Tax.form = new FormGroup( {
    name: new FormControl( '', [ Validators.required ] ),
    rate: new FormControl( '', [ Validators.required ] ),
    description: new FormControl( '' )
  }) as Tax.form

  constructor (
    private _taxes: TaxesService
  ) { }

  ngOnInit(): void {
    if ( this.value ) {
      let {index, ...value} = this.value
      this.taxForm.patchValue( { ...value })
    }
  }

  async onSubmit(): Promise<void> {
    if ( this.value )
      this._taxes.update( {
        ...this.taxForm.value,
        index: this.value.index
      } );
    else
      this._taxes.add( this.taxForm.value );
  }

}
