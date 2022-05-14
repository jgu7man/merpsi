import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Client, ClientModel } from 'src/app/modules/clients/clients.model';
import { FireDoc } from 'src/app/models/firestore.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  businessCRF: string = this._cache.getDataKey( 'eid' )!
  path: string = `businesses/${this.businessCRF}/clients`

  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _alert: MxAlert,
  ) { }

  get collectionRef() {
    return this._afs.collection<ClientModel>(this.path)
  }

  search(prefix: string) {
    return this._afs.collection<ClientModel>(this.path,
      ref => ref
      .where('name', '>=', prefix)
      .where('name', '<=', prefix + '~')
    ).valueChanges().pipe(
      tap(list => {console.log(list)})
    )
  }

  getAll(): Observable<ClientModel[]> {
    return this.collectionRef.valueChanges()
      .pipe(
        map(list => {
          console.log(list)
          return list
        }),
        catchError(error => {
          console.error(error);
          this._alert.error('No se logró cargar la lista del personal', error)
          return of([])
        })
      )
  }

  async save(client: ClientModel): Promise<void> {
    try{

      const clientRef = this._afs
        .collection( `businesses/${ this.businessCRF }/clients/` )
        .doc<ClientModel>( client.id ).ref;
      const id = clientRef.id;


      await clientRef.set({...client, id})
      this._alert.notify('Cliente guardado')

      return
    }catch(error){
      Swal.fire( {
        icon: 'error',
        text: 'No se pudo guardar'
      })
      return console.error(error)
    }

  }

  async delete(client: ClientModel) {
    try {
      await this._afs.doc(`businesses/${this.businessCRF}/clients/${client.id}`).delete()
      Swal.fire('cliente eliminado')
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
