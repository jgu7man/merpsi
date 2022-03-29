import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { MxTest } from 'libs/@marxa/devkit/test/mx-test.service';
import { Observable, of } from 'rxjs';
import { map,catchError, tap } from 'rxjs/operators';
import { iProvider, ProviderModel, QueryProvider } from 'src/app/models/provider.model';
import Swal from 'sweetalert2';
import { iBusiness } from '../models/empresa.model';
import firebase from "firebase/app";


@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  businessCRF: string = this._cache.getDataKey('eid')!
  providers: iProvider[] = []
  bussinesProviders: iBusiness[] = [];
  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _alert: MxAlert,
    private _test: MxTest,
  ) { 
    // this._test.testOn( this.findProviderByCRF )
    //   .then( async ( { crf } ) => {
    //     const provider = await this.findProviderByCRF( crf );
    //     console.log( provider )
    //   })
  }


  /**
   *
   *funcion que se encarga de traer todos los proveedores de una empresa
   * @return {*}  {Observable<ProviderModel[]>}
   * @memberof ProviderService
   */
  getAll(): Observable<ProviderModel[]> {
    return this._afs.collection<ProviderModel>(`businesses/${this.businessCRF}/providers`).valueChanges()
      .pipe(
        map(list => {
          const providers: ProviderModel[] = []
          list.forEach( prv => {
            providers.push(new ProviderModel(prv.CRF,prv.country,prv.name,prv.businessName,prv.type,prv.businessRef))
          })
          return providers
        }),
        catchError(error => {
          console.error(error);
          this._alert.error('No se logró cargar la lista del proveedores', error)
          return of([])
        })
      )


  }


  /**
   *
   * Funcion que encarga de Crear un Proveedor
   * @param {ProviderModel} provider
   * @memberof ProviderService
   */
  async create(provider: ProviderModel, documentRef: firebase.firestore.DocumentReference | null){
    try{
      const providerRef =  this._afs.collection<ProviderModel>(`businesses/${this.businessCRF}/providers`)
      .doc(provider.CRF).ref
      
      await providerRef.set({...provider,
        businessRef: documentRef})

      return providerRef
    }catch (error: any) {
      console.error(error)
      Swal.fire(
        {
          icon: 'error',
          text: error.message
        }
      )
      return null
    }
  }


  /**
   *
   * Funcion que se encarga de Eliminar un Proveedor
   * @param {ProviderModel} provider
   * @return {*}
   * @memberof ProviderService
   */
  async delete(provider: ProviderModel){
    try{
      await this._afs.doc<ProviderModel>(`businesses/${this.businessCRF}/providers/${provider.CRF}`).delete()
      Swal.fire('El proveedor ha sido eliminado')
    }catch(error){
      Swal.fire( {
        icon: 'error',
        text: 'No se pudo eliminar'
      })
      return console.error(error);
    }


  }

  async onSearch(criteria: string,prefix: string){
    try{
      if(criteria == 'name'){
        await this._afs.collection<iProvider>(`businesses/${this.businessCRF}/providers`, ref => ref
        .where ('name', '==' , prefix)).valueChanges().pipe(
          tap(list =>{ this.providers = list })
        )
      }
    }catch(error){
      Swal.fire( {
        icon: 'error',
        text: 'No se pudo eliminar'
      })
      return console.error(error);
    }


  }

  async findProviderByCRF(crf: string) {
    try {
      let providerResult = await this._afs
        .collection<QueryProvider>
        ( `businesses/${ this.businessCRF }/providers` ).ref
        .where( 'CRF', '==', crf )
        .get()
      let providerDoc = providerResult.docs.length > 0 ? providerResult.docs[0] : null

      if ( !providerDoc ) throw { message: 'No se enontró el proveedor' }
      let provider = await (new QueryProvider(providerDoc.data())) .get()
 
      return providerDoc
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        text: error.message
      })
      throw console.error(error);
    }

  }

  async findBusinessByCRF(crf: string) {
    try {

      let providerResult = await this._afs
        .collection<iBusiness>( 'businesses' )
        .ref.where( 'CRF', '==', crf ).get()
      
      let provider = providerResult.docs.length > 0
        ? providerResult.docs[ 0 ].data()
        : null

      return provider
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        text: error.message
      })
      return console.error(error);
    }

  }
}
