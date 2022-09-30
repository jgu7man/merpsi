import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxAlert, MxCache } from '@marxa/devkit';
import { filter, map, takeWhile } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { iMail, iMailResponse } from '../models/email.model';

@Injectable({
  providedIn: 'root'
})

export class EmailService {
  mailCollection: string = 'mails'
  

  constructor(
    private _afs: AngularFirestore,
    private _alert: MxAlert,
  ) { }
/**
 *metodo que envia el correo de invitacion
 *
 * @param {iMail} mail
 * @return {*}  {Promise<void>}
 * @memberof EmailService
 */
async sendEmail( mail: iMail): Promise<void> {
    try {
    const mailsCol = this._afs.collection( this.mailCollection)
    const mailRef = await mailsCol.add(mail)
    const mailId = mailRef.id
    return new Promise<void>( ( resolve, reject ) => {
      console.log( mailId )
      mailsCol.doc<iMail>( mailId ).valueChanges().pipe(
        map<iMail | undefined, iMailResponse | undefined>( doc => {
          console.log( doc )
          if ( doc && doc.delivery ) return doc.delivery
          else return undefined
        } ),
        filter(delivery => delivery ? true:false),
        map( (delivery: any) => {
          // if ( delivery ) {
            if ( delivery.state == 'ERROR' || delivery.state == 'SUCCESS' ) {
              //this._loading.toggleWaiting('close')
              if ( delivery.state == 'ERROR' ) {
                this._alert.notify( 'Error al enviar el correo' )
                reject( {
                  message: 'Error al enviar el correo',
                  state: delivery.state,
                  error: delivery.error
                } )
              } else {
                resolve( this._alert.notify( 'Mail enviado con éxito' ) )
              }
              return true
            } else {
                this._alert.notify( `Email status: ${ delivery.state }` )
                return false
            }
          // }
        } ),
        takeWhile(notifier => notifier === true)
      ).subscribe(/*val => console.log( val ) */ )
    })
  }catch(error:any){
    Swal.fire({ 
      icon: 'error',
      title: 'No se pudo enviar el correo',
      text: error.message
    })
      return console.error(error)
  }
}
}
