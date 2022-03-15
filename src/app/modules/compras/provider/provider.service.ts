import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxAlert, MxCache } from '@marxa/devkit';
import { Observable, of } from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { ProviderModel } from 'src/app/models/provider.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  businessCRF: string = this._cache.getDataKey('eid')!

  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _alert: MxAlert,
  ) { }

  getAll(): Observable<ProviderModel[]> {
    return this._afs.collection<ProviderModel>(`businesses/${this.businessCRF}/providers`).valueChanges()
      .pipe(
        map(list => {
          const providers: ProviderModel[] = []
          list.forEach( prv => {
            providers.push(new ProviderModel(prv.CRF,prv.country,prv.name,prv.bussinesName,prv.type,prv.businessRef))
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
}
