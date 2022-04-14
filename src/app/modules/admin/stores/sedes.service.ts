import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FireDoc } from 'src/app/models/firestore.model';
import Swal from 'sweetalert2';
import { iSede } from './sede.model';

@Injectable({
  providedIn: 'root'
})
export class SedesService {

  businessCRF: string = this._cache.getDataKey('eid')!

  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
  ) { }
  
  /**
  * metodo que escucha los cambios en la colección de las sedes de una empresa
  *
  * @return {*}  {Observable<iSede[]>}
  * @memberof SedesService
  */
  listenAll(): Observable<iSede[]> {
    return this._afs.collection<iSede>(`businesses/${this.businessCRF}/store`)
    .valueChanges({ ref: 'sede_id' })
      .pipe(
        catchError( error => {
        Swal.fire( {
          icon: 'error', 
          text: 'No se logró cargar las sedes'
        })
        return of([])
      })
    )
  }

  /**
  * metodo que regresa documentos de firestore de tipo iStore
  *
  * @return {*}  {Observable<iSede[]>}
  * @memberof SedesService
  */
  async getAll(): Promise<FireDoc<iSede>[]> {
    const storesRef = this._afs.collection<iSede>(`businesses/${this.businessCRF}/store`).ref
    const storesCol = await storesRef.get()
    return storesCol.size > 0 ? storesCol.docs : []
  }

  /**
   *metodo que guarda o actualiza una sede de una empresa
   *
   * @param {iSede} sede
   * @return {*} 
   * @memberof SedesService
   */
  async save(sede: iSede) {
    try {
      console.log(sede)
      const sedeRef = sede.id
      ? this._afs.doc(`businesses/${this.businessCRF}/store/${sede.id}`).ref
      : this._afs.collection(`businesses/${this.businessCRF}/store/`).doc().ref
      let id = sedeRef.id
      await sedeRef.set({ ...sede, id })
      Swal.fire('Guardado')
      return
    } catch (error) {
      Swal.fire( {
        icon: 'error', 
        text: 'No se pudo guardar'
      })
      return console.error(error)
    }
  }

  async delete(sede: iSede) {
    try {
      await this._afs.doc(`businesses/${this.businessCRF}/store/${sede.id}`).delete()
      Swal.fire('Sede eliminada')
      return
    } catch (error) {
      Swal.fire( {
        icon: 'error', 
        text: 'No se pudo eliminar'
      })
      return console.error(error);
    }
  }
}
