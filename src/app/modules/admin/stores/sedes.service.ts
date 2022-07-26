import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FireDoc } from 'src/app/models/firestore.model';
import { DatabasePathsService } from 'src/app/services/database-paths.service';
import Swal from 'sweetalert2';
import { iSede } from './sede.model';

@Injectable({
  providedIn: 'root'
})
export class SedesService {

  businessCRF: string = this._cache.getDataKey( 'eid' )!
  list$ = new BehaviorSubject<iSede[]>( [] )

  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _path: DatabasePathsService
  ) { 
    this.listenAll().subscribe(list => this.list$.next(list))
  }
  
  /**
  * metodo que escucha los cambios en la colección de las sedes de una empresa
  *
  * @return {*}  {Observable<iSede[]>}
  * @memberof SedesService
  */
  listenAll(): Observable<iSede[]> {
    return this._afs.collection<iSede>(`${this._path.storeRef}`)
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
    const storesRef = this._afs.collection<iSede>(`${this._path.storeRef}`).ref
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
      ? this._afs.doc(`${this._path.storeRef}/${sede.id}`).ref
      : this._afs.collection(`${this._path.storeRef}/`).doc().ref
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
      await this._afs.doc(`${this._path.storeRef}/${sede.id}`).delete()
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
