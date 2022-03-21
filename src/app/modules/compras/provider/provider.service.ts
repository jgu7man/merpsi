import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxAlert, MxCache } from '@marxa/devkit';
import { Observable, of } from 'rxjs';
<<<<<<< HEAD
import { map,catchError } from 'rxjs/operators';
import { ProviderModel } from 'src/app/models/provider.model';
=======
import { map,catchError, tap } from 'rxjs/operators';
import { iProvider, ProviderModel } from 'src/app/models/provider.model';
>>>>>>> mari
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  businessCRF: string = this._cache.getDataKey('eid')!
<<<<<<< HEAD

=======
  providers: iProvider[] = []
>>>>>>> mari
  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _alert: MxAlert,
  ) { }

<<<<<<< HEAD
=======

  /**
   *
   *funcion que se encarga de traer todos los proveedores de una empresa
   * @return {*}  {Observable<ProviderModel[]>}
   * @memberof ProviderService
   */
>>>>>>> mari
  getAll(): Observable<ProviderModel[]> {
    return this._afs.collection<ProviderModel>(`businesses/${this.businessCRF}/providers`).valueChanges()
      .pipe(
        map(list => {
          const providers: ProviderModel[] = []
          list.forEach( prv => {
<<<<<<< HEAD
            providers.push(new ProviderModel(prv.CRF,prv.country,prv.name,prv.bussinesName,prv.type,prv.businessRef))
=======
            providers.push(new ProviderModel(prv.CRF,prv.country,prv.name,prv.businessName,prv.type,prv.businessRef))
>>>>>>> mari
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

<<<<<<< HEAD
  async create(provider: ProviderModel) {
    try{
      await this._afs.collection<ProviderModel>(`businesses/${this.businessCRF}/provider`)
      .doc(provider.CRF)
      .set({...provider})
  
      Swal.fire("El proveedor se ha guardado con exito")
  
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

  async update(provider: ProviderModel) {
    try{
      await this._afs.collection<ProviderModel>(`businesses/${this.businessCRF}/provider`)
      .doc(provider.CRF)
      .update({...provider})
  
      Swal.fire("El proveedor se ha guardado con exito")
  
=======

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

>>>>>>> mari
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

<<<<<<< HEAD
=======

  /**
   *
   * Funcion que se encarga de Eliminar un Proveedor
   * @param {ProviderModel} provider
   * @return {*} 
   * @memberof ProviderService
   */
>>>>>>> mari
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
<<<<<<< HEAD
=======

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
>>>>>>> mari
}
