import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MxAuth } from '@marxa/auth';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ManagerModel } from './manager.model';
import { EmailService } from '../../../services/email.service';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { UsuarioModel } from './personal.model';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  businessCRF: string = this._cache.getDataKey('eid')!
  
  constructor(
    private _afs: AngularFirestore,
    private _afAuth: AngularFireAuth,
    private _alert: MxAlert,
    private _cache: MxCache,
    private _router: Router,
    private _mails: EmailService,
    private _auth: AuthService,
    private _dashboard: DashboardService
  ) { }

  getAll(): Observable<ManagerModel[]> {
    return this._afs.collection<ManagerModel>(`businesses/${this.businessCRF}/managers`).valueChanges()
      .pipe(
        map(list => {
          const users: ManagerModel[] = []
          list.forEach( user => {
            users.push(new ManagerModel(user.email,user.name,user.uid,user.CRF,user.rol))
          })
          return users
        }),
        catchError(error => {
          console.error(error);
          this._alert.error('No se logró cargar la lista del personal', error)
          return of([])
        })
      )
  }

  async update(user: ManagerModel) {
    try {
      
      let uid_email = user.uid ? user.uid : user.email
      await this._afs.collection<ManagerModel>(`businesses/${this.businessCRF}/managers`).doc(uid_email)
        .update({ ...user })
      Swal.fire('Usuario actualizado')
      return
    } catch (error) {
      console.error(error)
      this._alert.error('No se logró guardar', error)
      return
    }
  }

  /**
   *metodo para agregar un manager
   *
   * @param {ManagerModel} user
   * @memberof PersonalService
   */
  async add(user: ManagerModel) {
    try {
      
      user.CRF = this.businessCRF
      await this._afs.collection<ManagerModel>(`businesses/${this.businessCRF}/managers`)
          .doc(user.email)
          .set({ ...user })
      Swal.fire('Usuario agregado')

      /** enviamos correo de notificacion para el manager */
      await this.sendInvitationEmail(user.email,user.CRF)

      console.log(user)
      
      return

    } catch (error) {
      console.error(error)
      this._alert.error('No se pudo crear la cuenta', error)
      return
    }
  }

  async create(user: UsuarioModel) {
    try {
      let {email, password} = user
      let created = await this._afAuth.createUserWithEmailAndPassword(email, password as string)
      if (created.user) {
        user.uid = created.user.uid
        user.lastAccess = new Date()
        delete user.password
        await this._afs.doc(`admins/${created.user.uid}`).set({ ...user })
        await this._afs.doc(`admins/${email}`).ref.delete()
        this._alert.notify('Cuenta creada')
        this._cache.updateData('user', user)
        this._router.navigate(['/dashboard'])

      } else {
        this._alert.message('NO se otorgaron credenciales. Error desconocido')
        return
      }


    } catch (error: any) {
      console.error(error)
      if (error.code === 'auth/email-already-in-use') {
        this._alert.message('Este correo ya está en uso, elige otro')
      } else {
        this._alert.error('No se pudo crear la cuenta de autenticación. Esto puede deberse a problemas con internet o permisos para hacerlo', error)
      }
    }
  }

  async revoke(user: UsuarioModel) {
    try {
      this._afs.collection('admins').doc(user.uid).update({ rol: 'revoke' })
      this._alert.notify('Se revocaron los accesos')
      return
    } catch (error) {
      console.error(error)
      this._alert.error('No  se pudo revocar accesos', error)
      return
    }
  }


/**
 * Metodo que arma el correo de invitacion para el manager
 *
 * @param {string} email
 * @param {string} CRF
 * @memberof PersonalService
 */
async sendInvitationEmail(email: string, CRF: string){

    const splitDomain = window.location.href.split('/')
    const domain = splitDomain[0] === 'localhost' ? splitDomain[0]
      : 'https://' + splitDomain[2]

      let mail = {
        to: email,
        message: {
          subject:`Invitacion`,
          html: `
          <p> se te ha invitado a registrarte en MERPSI
          <br>
          <p> Por Favor da click en este en el siguiente enlace para registrarte:
          <a href='${domain}/registro/create?email=${ email }&crf=${ CRF}'>
          ${domain }/registro/create?email=${ email }&crf=${ CRF}
          </a>
          <br>
          </p>`
        }
      }

      await this._mails.sendEmail(mail).catch(error => {
        throw Swal.fire({
          icon: 'error',
          title: 'No pudo enviarse el correo de notificación.',
          text: error})
      })

  }

    get current() {
      return this._auth.userState$.value
    }

    get managerRef(){
      let user = this._auth.userState$.value
      if (!user) throw {message: 'No se ha iniciado sesión'}
       return this._dashboard.businessRef
        .collection( 'managers' )
        .doc<ManagerModel>( user.uid )
        .ref
    }

}
