import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { MxLoading } from 'libs/@marxa/devkit/loading/loading.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { iStub, Stub, StubModel } from './stub.model';

@Injectable({
  providedIn: 'root'
})
export class StubService {
  
  businessCRF: string = this._cache.getDataKey( 'eid' )!
  private _listSubscription: Subscription
  list$:BehaviorSubject<iStub[]> = new BehaviorSubject<iStub[]>( [] )

  constructor(
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _loading: MxLoading,
    private _alert: MxAlert

  ) {
    this._listSubscription = this.listenList().subscribe()

   }

  get stubRef() {
    try {
      if (!this.businessCRF) throw { message: 'No se pudo encontrar el id de la empresa' }
      return this._afs.doc<Stub.list>(`businesses/${this.businessCRF}/config/stubs`)
    } catch (error) {
      throw error
    }
  }

  private listenList() {
    return this.stubRef.valueChanges().pipe(
      map(doc => doc?.list || []),
      tap((list) => this.list$.next(list))
    )
  }

  async add(stub: StubModel) {
    try {
      const list = this.list$.value
      const stubData = new StubModel(list.length, stub)
      list.push({ ...stubData })
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
  
  async update(stub: StubModel) {
    try {
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
      list.splice(index, 1)
      await this.stubRef.update( { list } )
      
      this._loading.spinner( 'close' )
      this._alert.notify( 'Talonario eliminado' )
      
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

}
