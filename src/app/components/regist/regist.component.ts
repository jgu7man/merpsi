import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { iManagerRegist } from 'src/app/models/manager.model';
import { AuthService } from 'src/app/services/auth.service';
import { BusinessService } from 'src/app/services/business.service';
import { iRegistFormChanges } from '../generic-regist-form/generic-regist-form.model';

@Component({
  templateUrl: './regist.component.html',
  styleUrls: ['./regist.component.scss']
})
export class RegistComponent implements OnInit {


  registForm: FormGroup = new FormGroup( {
    country: new FormControl('', [Validators.required]),
    CRF: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    businessName: new FormControl('', [Validators.required]),
    type: new FormControl( 'juridica', [ Validators.required ] ),
  } )
  
  register?: iManagerRegist
  managerFormValid: boolean = false
  
  constructor (
    private _auth: AuthService,
    private _business: BusinessService
  ) { }

  ngOnInit(): void {
  }

  onManagerFormChanges(event: iRegistFormChanges) {
    this.register = event.values
    this.managerFormValid = event.valid
  }

  async onSubmit() {
    console.log( this.register )
    console.log(this.registForm.value)
    await this._auth.regist(this.registForm.value,this.register!)

  }

  /**
   *Funcion para validar CRF en el imput con onblur
   *
   * @param {string} CRF
   * @memberof RegistComponent
   */
  public async validateCRF(CRF: string) {
      let validation = CRF ? await this._business.validateBusiness(this.registForm.controls.CRF.value) : null
  }

}
