import { AbstractControl, FormGroup } from "@angular/forms"
import { createDate, FireRef, FireTime } from "src/app/models/firestore.model"
import { ManagerModel } from "../admin/managers/manager.model"

export class ClientModel{
  readonly id?: string
  registered: FireTime
  lastContact: FireTime
  public contact?: Client.contact

  tags: string[]

  constructor (
    public name: string,
    /** Clave de Indentificacion Personal (cedula) */
    public CRF?: string,
    email?: string,
    cellphone?: string,
    facebookId?: string,
  ) {

    this.registered = createDate( new Date() )
    this.lastContact = createDate( new Date() )
    this.tags = [ 'Nuevo' ]

    this.contact = {
      email: email || '',
      cellphone: cellphone || '',
      facebookId: facebookId || '',
    }
  }

}

export declare namespace Client {

  export interface address {
    streetName?: string,
    streetNumber?: string,
    neighborhood?: string,
    city?: string,
    state?: string,
    country?: string,
    zipCode?: string
  }

  export interface contact {
    cellphone?: string,
    email?: string,
    facebookId?: string
  }

  export interface management {
    managerRef?: FireRef<ManagerModel>
    attendedBy?: string
    lastAttendedDate?: FireTime
    attendedNotes?: string[]
  }

  export interface registForm {
    name: string
    cellphone: string
    email: string
    CRF: string
  }

  export interface form extends FormGroup {
    value: registForm
    controls: {
      name: AbstractControl,
      cellphone: AbstractControl,
      email: AbstractControl,
      CRF: AbstractControl,
    }
  }

}
