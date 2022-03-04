import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { iCountry } from 'src/app/models/country.model';
import { iManagerRegist } from 'src/app/models/manager.model';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { BusinessService } from 'src/app/services/business.service';
import { iRegistFormChanges } from '../generic-regist-form/generic-regist-form.model';

@Component({
  templateUrl: './regist.component.html',
  styleUrls: ['./regist.component.scss']
})
export class RegistComponent implements OnInit {



  /** 
   * Modelo reactivo del formulario de la empresa
   * 
   * @type {FormGroup}
   */
  public registForm: FormGroup = new FormGroup( {
    country: new FormControl('', [Validators.required]),
    CRF: new FormControl('', [Validators.required] ),
    name: new FormControl('', [Validators.required]),
    businessName: new FormControl('', [Validators.required]),
    type: new FormControl( '', [ Validators.required ] ),
  } )
  /** 
   * Objeto que recibe los datos del manager que registra la empresa
   *
   * @type {iManagerRegist | undefined}
   */
  public register?: iManagerRegist
  /**
   * Adminsitra la validación del formulario de manager
   *
   * @type {boolean}
   */
  public managerFormValid: boolean = false
  public countryList: iCountry[] = []
  constructor (
    private _auth: AuthService,
    private _business: BusinessService,
    private _admin: AdminService
  ) { 
    
  }

  async ngOnInit(): Promise<void> {
    this.countryList = await this._admin.getCountry()
  }

  
  /** Recibe los cambios realizados en el formulario del Manager
   * @param {iRegistFormChanges} event Recibe 2 propiedades: la data y la validación del formulario
   */
  onManagerFormChanges(event: iRegistFormChanges) {
    this.register = event.values
    this.managerFormValid = event.valid
  }



  /** Llamado al servicio de registro de empresa y manager */
  async onSubmit() {
    await this._auth.regist(this.registForm.value,this.register!)
  }

  /** Funcion para validar CRF en el imput con onblur
   * @param {string} CRF
   * @memberof RegistComponent
   */
  public async validateCRF( CRF: string ) {
    let validation = CRF ? await this._business.validateBusiness( this.registForm.controls.CRF.value ) : null
    if (validation) this.registForm.controls.CRF.setErrors({exists: true})
  }

}
