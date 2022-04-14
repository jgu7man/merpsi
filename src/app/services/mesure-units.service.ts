import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxAlert } from 'libs/@marxa/devkit/alert/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { MxLoading } from 'libs/@marxa/devkit/loading/loading.service';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MesureUnit, MesureUnitModel } from '../models/mesure-unit.model';

@Injectable({
  providedIn: 'root'
})
export class MesureUnitsService {

  list$ = new BehaviorSubject<MesureUnitModel[]>( [] )
  businessCRF: string = this._cache.getDataKey( 'eid' )!

  constructor (
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _loading: MxLoading,
    private _alert: MxAlert
  ) { 
    this.listenList().subscribe()
  }

  get ref() {
    try {
      if ( !this.businessCRF ) throw { message: 'No se pudo encontrar el id de la empresa' }
      const path: string = `businesses/${this.businessCRF}/config/mesure_units`
      return this._afs.doc<MesureUnit.list>(path)
    } catch ( error ) {
      throw error
    }
  }

  private listenList() {
    return this.ref.valueChanges().pipe(
      map(doc => doc?.list || [] ),
      tap((list) => this.list$.next(list))
    )
  }

  async add( {
    name, description, symbol, singular, plural, zero
  }: MesureUnit.data ) {
    this._loading.spinner('open')
    
    try {
      const list = this.list$.value
      const unit = new MesureUnitModel( list.length, name, description, symbol, singular, plural, zero, )
        // .value as MesureUnitModel
      list.push( {...unit} as MesureUnitModel )
      await this.ref.set( { list } )
    
      this._loading.spinner( 'close' )
      this._alert.notify( 'Unidad de medida agregada')

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

  async update( value: MesureUnitModel ) {
    try {
      this._loading.spinner('open')
      const list = this.list$.value
      list[ value.index ] = value
      await this.ref.set( { list } )
      
      this._loading.spinner( 'close' )
      this._alert.notify('Unidad de medida actualizada')
    
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

  async delete( { index }: MesureUnitModel ) {
    try {
      this._loading.spinner('open')
      const list = this.list$.value
      list.splice(index, 1)
      await this.ref.update( { list } )
      
      this._loading.spinner( 'close' )
      this._alert.notify( 'Unidad de medida eliminada' )
      
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




