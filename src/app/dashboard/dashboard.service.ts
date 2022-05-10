import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { ManagerModel } from '../modules/admin/managers/manager.model';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor (
    private _cache: MxCache,
    private _afs: AngularFirestore,
    private _auth: AuthService,
  ) { }

  /** Consulta en sessionStorage el ID de la empresa en la cuál se está presente */
  get CRF() {
    const CRF = this._cache.getDataKey( 'eid' )
    if ( CRF === undefined ) throw { message: 'No se encuentró el ID de la empresa' }
    return CRF
  }

  /** Crea la referencia a firestore para la empresa en la cuál se está presente */
  get businessRef() {
    return this._afs.doc(`businesses/${this.CRF}`)
  }

  /**
   * Referencia Firestore del manager autenticado
   */
   get managerRef() {
    let user = this._auth.userState$.value
    if (!user) throw {message: 'No se ha iniciado sesión'}
     let userRef = this._afs.doc
       <ManagerModel>( `businesses/${ this.CRF }/mangers/${ user.uid }` ).ref
    return userRef
  }
}
