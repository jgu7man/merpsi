import { AbstractControl, FormGroup } from "@angular/forms"
import { createDate, FireDoc, FireRef, FireTime } from "src/app/models/firestore.model"
import { ManagerModel } from "../admin/managers/manager.model"

export class ClientModel{

  readonly registered: FireTime = createDate( new Date() )
  readonly id?: string

  public name: string
  public CRF?: string
  public contact?: Client.contact
  public tags: string[]
  public address?: Client.address
  public managment?: FireRef<ManagerModel>

  public lastAttended!: ClientEventModel


  constructor (
    { name,
      CRF,
      email,
      cellphone,
      facebookId,
    }: Client.RegistData,
    address?: Client.address,
    attended?: Client.attended,
    tags?: string[],
  ) {

  /* Set name */
    this.name = name
  /* Set CRF if there are */
    if ( CRF ) this.CRF = CRF
    else delete this.CRF
  /* Set contact */
    this.setContact( email, cellphone, facebookId )
  /* Set tags */
    this.tags = [ 'Nuevo', ...( tags || [] ) ]

    if ( !address ) delete this.address;
    if ( !attended ) delete this.managment;
    else this.setLastEvent(attended)
  }

  setContact(email?: string, cellphone?: string, facebookId?: string) {
    this.contact = {
      email: email || '',
      cellphone: cellphone || '',
      facebookId: facebookId || '',
    }

    Object.keys( this.contact ).forEach( key => {
      if ( !this.contact![ key as keyof Client.contact ] )
        delete this.contact![ key as keyof Client.contact ]
    } )
  }

  setLastEvent( {
    attendedBy,
    managerRef,
    attendedNotes,
    eventRef
  }: Client.attended ) {
    this.lastAttended = new ClientEventModel(
      'created',
      attendedBy || 'itSelf',
      managerRef,
      attendedNotes,
      eventRef,
    )
  }

  getAddress(separator: string = '\n', includesZipCode: boolean = true): string {
    if ( !this.address ) return ''

    let { streetName, streetNumber, neighborhood, city, state, country, zipCode } = this.address
    return `${ streetName && streetNumber ? `${ streetName || '' }${ `, ${ streetNumber || '' }` }` : ''
      }${ neighborhood ? `${separator}${ neighborhood }` : ''
      }${ city ? `${separator}${ city }` : ''
      }${ state ? `${separator}${ state }` : ''
      }${ country ? `${ separator }${ country }` : ''
      }${ includesZipCode && zipCode ? `${separator}${ zipCode }` : '' }`
  }
}



export declare namespace Client {

  export interface main extends
    Omit<ClientModel, 'setContact' | 'getAddress'>{ }

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

  export interface attended extends Omit<ClientEventModel,
    | 'type'
    | 'date'
  > {}

  export interface FormData extends contact {
    name: string,
    CRF?: string,
  }

  export interface registByEmail extends Omit<FormData, 'email'> { email: string }
  export interface registByCellphone extends Omit<FormData, 'cellphone'> { cellphone: string }
  export interface registByFacebook extends Omit<FormData, 'facebookId'> { facebookId: string }

  /** Regist Data requires at least one of email, cellphone or facebookId */
  export type RegistData = registByFacebook | registByCellphone | registByEmail

  export interface form extends FormGroup {
    value: RegistData
    controls: {
      name: AbstractControl,
      cellphone: AbstractControl,
      email: AbstractControl,
      CRF: AbstractControl,
    }
  }

  export type UpdateType = 'created' | 'updated' | 'deleted' | 'sale' | 'attended' | 'called'

}



export class ClientEventModel {
  date: FireTime = createDate( new Date() )

  constructor (
    /** El tipo de evento que se está registrando */
    public type: Client.UpdateType,

    public attendedBy: string = 'self',
    /** Referencia de manager que realiza el evento */
    public managerRef?: FireRef<ManagerModel>,

    public attendedNotes?: string[],
    /* Referencia a la factura o arqueo que tuvo efecto en la modificación del producto */
    public eventRef?: FireRef<any>
  ) {
    if (!managerRef) delete this.managerRef;
    if (!attendedNotes) delete this.attendedNotes;
    if (!eventRef) delete this.eventRef;
  }

}
