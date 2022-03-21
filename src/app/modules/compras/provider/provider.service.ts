import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxAlert, MxCache } from '@marxa/devkit';
import { Observable, of } from 'rxjs';
import { map,catchError, tap } from 'rxjs/operators';
import { iProvider, ProviderModel } from 'src/app/models/provider.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  businessCRF: string = this._cache.getDataKey('eid')!
  providers: iProvider[] = []
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
      if(criteria == 'nombre'){
        await this._afs.collection<iProvider>(`businesses/${this.businessCRF}/providers`, ref => ref
        .where ('nombre', '==' , prefix)).valueChanges().pipe(
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
}
