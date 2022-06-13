import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Client, ClientModel } from 'src/app/modules/clients/clients.model';
import { FireDoc } from 'src/app/models/firestore.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  businessCRF: string = this._cache.getDataKey( 'eid' )!
  path: string = `businesses/${ this.businessCRF }/clients`
  current$ = new BehaviorSubject<ClientModel | null>(null);
  registForm$ = new BehaviorSubject<Client.RegistData | null>( null )
  addressForm$ = new BehaviorSubject<Client.address | null>( null )
  valid$ = new BehaviorSubject<boolean>( true )

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

  async save(): Promise<ClientModel | null> {
    try{

      /* Organiza la data de registro */
      const client = await this.setClient()

      const clientRef = this._afs
        .collection( `businesses/${ this.businessCRF }/clients/` )
        .doc<ClientModel>( client.id ).ref;
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
      client = new ClientModel(
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
      } as ClientModel
    }

    client = this.setAddress( client )

    return client

  }

  async setAddress(client: ClientModel) {
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
