import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { Observable, of } from 'rxjs';
import { map,catchError, tap } from 'rxjs/operators';
import { iProvider, ProviderModel } from 'src/app/models/provider.model';
import Swal from 'sweetalert2';
import { iBusiness } from '../models/empresa.model';


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
  ) { }


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
  async create(provider: ProviderModel, documentRef: any | null){
    try{
      await this._afs.collection<ProviderModel>(`businesses/${this.businessCRF}/providers`)
      .doc(provider.CRF)
      .set({...provider,
        businessRef: documentRef})

      return
    }catch (error: any) {
      console.error(error)
      Swal.fire(
        {
          icon: 'error',
          text: error.message
        }
      )
      return
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
      let provider: iBusiness | any = null
      let providerResult = await this._afs.collection(`businesses/${this.businessCRF}/providers`).ref.where('CRF', '==', crf).get()
      provider = providerResult.docs.length > 0 ? providerResult.docs[0].data() : null

      return provider
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        text: error.message
      })
      return console.error(error);
    }

  }

  async findBusinessByCRF(crf: string) {
    try {

      let providerResult = await this._afs.collection('businesses').ref.where('CRF', '==', crf).get()
      let providerRef = providerResult.docs.length > 0 ? providerResult.docs[0] : null

      return providerRef
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        text: error.message
      })
      return console.error(error);
    }

  }
}
