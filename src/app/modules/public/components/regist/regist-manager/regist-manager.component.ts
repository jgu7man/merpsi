import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { iRegistFormChanges } from 'src/app/components/generic-regist-form/generic-regist-form.model';
import { iManagerRegist } from 'src/app/modules/admin/personal/manager.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  templateUrl: './regist-manager.component.html',
  styleUrls: ['./regist-manager.component.scss']
})
export class RegistManagerComponent implements OnInit {
  params: any;

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
  * */
  public managerFormValid: boolean = false

  constructor(
    private _route: ActivatedRoute,
    private _auth: AuthService
  ) { 
    this.params = this._route.snapshot.queryParams
  }

  ngOnInit(): void {
  }

 async onSubmit() {
    //console.log(this.register)

    //llamamos al metodo para crear la cuenta del manager se envian como parametros los datos del formulario y el CRF que se toma de la url 
    await this._auth.registManagerInvited(this.register!,this.params.crf)
  }

  /**
   *metodo de validacion de formularios
   *
   * @param {iRegistFormChanges} event
   * @memberof RegistManagerComponent
   */
  onManagerFormChanges(event: iRegistFormChanges) {
    this.managerFormValid = event.valid
    this.register = event.values
  }

}
