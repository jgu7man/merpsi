import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor (
    private _cache: MxCache,
    private _afs: AngularFirestore,
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
}
