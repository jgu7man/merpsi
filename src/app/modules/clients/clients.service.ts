import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ClientModel } from 'src/app/modules/clients/clients.model';
import { FireDoc } from 'src/app/models/firestore.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  businessCRF: string = this._cache.getDataKey('eid')!

  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _alert: MxAlert,
  ) { }

  getAll(): Observable<ClientModel[]> {
    return this._afs.collection<ClientModel>(`businesses/${this.businessCRF}/clients`).valueChanges()
      .pipe(
        map(list => {
          const clients: ClientModel[] = []
          list.forEach( cli => {
            clients.push(new ClientModel(cli))
          })
          console.log(clients)
          return clients
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
      const clientRef = client.id ? this._afs.doc(`businesses/${this.businessCRF}/clients/${client.id}`).ref 
      : this._afs.collection(`businesses/${this.businessCRF}/clients/`).doc().ref
      const id = clientRef.id
      await clientRef.set({...client, id})
      await Swal.fire('Guardado')

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
