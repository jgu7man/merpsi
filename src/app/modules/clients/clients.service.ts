import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxAlert, MxCache } from '@marxa/devkit';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Client, ClientCreationModel } from 'src/app/modules/clients/clients.model';
import Swal from 'sweetalert2';
import { DatabasePathsService } from 'src/app/services/database-paths.service';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  businessCRF: string = this._cache.getDataKey( 'eid' )!
  path: string = `businesses/${ this.businessCRF }/clients`
  current$ = new BehaviorSubject<ClientCreationModel | null>(null);
  registForm$ = new BehaviorSubject<Client.RegistData | null>( null )
  addressForm$ = new BehaviorSubject<Client.address | null>( null )
  valid$ = new BehaviorSubject<boolean>( true )

  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _alert: MxAlert,
    private _path: DatabasePathsService
  ) { }

  get collectionRef() {
    return this._afs.collection<ClientCreationModel>(this._path.clientRef)
  }

  search(prefix: string) {
    return this._afs.collection<ClientCreationModel>(this._path.clientRef,
      ref => ref
      .where('name', '>=', prefix)
      .where('name', '<=', prefix + '~')
    ).valueChanges().pipe(
      tap(list => {console.log(list)})
    )
  }

  getAll(): Observable<ClientCreationModel[]> {
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

  async save(): Promise<ClientCreationModel | null> {
    try{

      /* Organiza la data de registro */
      const client = await this.setClient()

      const clientRef = this._afs
        .collection( this._path.clientRef )
        .doc<ClientCreationModel>( client.id ).ref;
      const id = client.id || clientRef.id;

      await clientRef.set( { ...client, id }, { merge: true }  );
      this._alert.notify( 'Cliente guardado' );

      return client
    }catch(error){
      Swal.fire( {
        icon: 'error',
        text: 'No se pudo guardar'
      })
      console.error( error )
      return null
    }

  }

  async setClient( ) {
    // if ( !this.current$.value ) throw new Error( 'No hay cliente seleccionado' )
    if ( !this.registForm$.value ) throw new Error( 'No hay datos para registrar' )

    const currentClient = this.current$.value
    const { name, email, cellphone, CRF } = this.registForm$.value
    let client
    if ( !currentClient ) {
      client = new ClientCreationModel(
        {
          name, CRF,
          email: email || '',
          cellphone: cellphone || '',
        }
      )

    } else {
      client = {
        ...currentClient,
        name,
        CRF,
        contact: {
          ...currentClient.contact,
          email: email || '',
          cellphone: cellphone || '',
        }
      } as ClientCreationModel
    }

    client = this.setAddress( client )

    return client

  }

  async setAddress(client: ClientCreationModel) {
    if ( !this.addressForm$.value ) return client
    if ( !client.address ) client.address = {}

    const { streetName, streetNumber, neighborhood, city, state, zipCode, country } = this.addressForm$.value
    if ( streetName ) client.address.streetName = streetName
    if ( streetNumber ) client.address.streetNumber = streetNumber
    if ( neighborhood ) client.address.neighborhood = neighborhood
    if ( city ) client.address.city = city
    if ( state ) client.address.state = state
    if ( zipCode ) client.address.zipCode = zipCode
    if ( country ) client.address.country = country

    return client
  }

  async delete(client: ClientCreationModel) {
    try {
      await this._afs.doc(`${this._path.clientRef}/${client.id}`).delete()
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
