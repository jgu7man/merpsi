import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxAlert, MxCache, MxLoading } from '@marxa/devkit';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DatabasePathsService } from 'src/app/services/database-paths.service';
import Swal from 'sweetalert2';
import { iStub, Stub, StubModel } from './stub.model';

@Injectable({
  providedIn: 'root'
})
export class StubService {
  
  
  businessCRF: string = this._cache.getDataKey( 'eid' )!
  list$:BehaviorSubject<iStub[]> = new BehaviorSubject<iStub[]>( [] )
  stubSelect: iStub | null = null
  stubList$: BehaviorSubject<iStub[]> = new BehaviorSubject<iStub[]>( [] );

  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _loading: MxLoading,
    private _alert: MxAlert,
    private _path: DatabasePathsService

  ) {
    this.listenList().subscribe()
   }

  get stubRef() {
    try {
      return this._afs.doc<Stub.list>(`${this._path.stubRef}`)
    } catch (error) {
      throw error
    }
  }

  public listenList() {
    return this.stubRef.valueChanges().pipe(
      map(doc => doc?.list || []),
      tap((list) => this.list$.next(list))
    )
  }

  async add(stub: StubModel) {
    try {
      const list = this.list$.value
      const stubData = new StubModel(list.length, stub)
      list.push({...stubData})
      await this.stubRef.set({ list })
    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('Mensaje de error', error)
      }
      return console.error(error)
    }
  }
  
  async update(stub: StubModel | iStub) {
    try {
      //
      /**Desactivo el Talonario en caso de que la numeracion se termine */
      if (stub.currentIndex >= stub.endIndex) {
        stub.active = false
      }
      const list = this.list$.value
      list[stub.index] = stub
      await this.stubRef.set({ list })
      this._alert.notify('Talonario actualizado')

    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }
  }

  async delete( { index }: StubModel ) {
    try {
      this._loading.spinner('open')
      const list = this.list$.value
      if (list[index].active != true){
        list.splice(index, 1)
        await this.stubRef.update( { list } )
        
        this._loading.spinner( 'close' )
        this._alert.notify( 'Talonario eliminado' )
      }else{
        Swal.fire('El Talonario no puede ser eliminado porque se encuentra activo')
      }
      
    } catch ( error: any ) {
      this._loading.spinner('close')
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }
  }

  selectStub(data: iStub) {
    try {
      this.stubSelect = data
    let stub = this.stubSelect
    stub.prefixIndexCurrent = stub.prefix + '-' + ((stub.currentIndex || 0) + 1)
    return stub
    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }
  }

}
