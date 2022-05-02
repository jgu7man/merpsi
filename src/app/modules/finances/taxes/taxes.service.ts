import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxAlert } from 'libs/@marxa/devkit/alert/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { MxLoading } from 'libs/@marxa/devkit/loading/loading.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BusinessModel } from 'src/app/models/empresa.model';
import { AppliedTaxModel, GlobalTax, iAppliedTax, Tax, TaxModel } from './taxes.model';

@Injectable({
  providedIn: 'root'
})
export class TaxesService {

  list$ = new BehaviorSubject<TaxModel[]>( [] )
  businessCRF: string = this._cache.getDataKey( 'eid' )!
  applidedTaxes: AppliedTaxModel[] = []

  private _listSubscription: Subscription

  constructor (
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _loading: MxLoading,
    private _alert: MxAlert
  ) { 
    this._listSubscription = this.listenList().subscribe()
  }

  get ref() {
    try {
      if ( !this.businessCRF ) throw { message: 'No se pudo encontrar el id de la empresa' }
      const path: string = `businesses/${this.businessCRF}/config/taxes`
      return this._afs.doc<Tax.list>(path)
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
    name, rate, description
  }: Tax.data ) {
    this._loading.spinner( 'open' )
    
    try {

      const list = this.list$.value
      const unit = new TaxModel( list.length, name, rate, description )
      list.push({...unit} )
      await this.ref.set( { list } )

      this._loading.spinner( 'close' )
      this._alert.notify( 'Impuesto agregado' )
      this._setGlobalTax(unit)

    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('Mensaje de error', error)
      }
      return console.error(error)
    }
  }

  async update( value: TaxModel ) {
    try {
      this._loading.spinner('open')
      const list = this.list$.value
      list[ value.index ] = value
      await this.ref.set( { list } )
      
      this._loading.spinner( 'close' )
      this._alert.notify('Impuesto actualizado')
    
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

  async delete( { index }: TaxModel ) {
    try {
      this._loading.spinner('open')
      const list = this.list$.value
      list.splice(index, 1)
      await this.ref.update( { list } )
      
      this._loading.spinner( 'close' )
      this._alert.notify( 'Impuesto eliminado' )
      
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

  private async  _setGlobalTax({name, rate, description, slug}: TaxModel) {
    try {

      /* Obtenemos la lista actual de impuestos */
      const globalTaxesRef = this._afs.doc< { list: GlobalTax[] } >( `_admin/taxes` ).ref
      const listDoc = await globalTaxesRef.get()
      const list = listDoc.data()?.list || []

      /* Obtenermos el país de la empresa */
      const businessDoc = await this._afs.doc<BusinessModel>( `businesses/${ this.businessCRF }` ).ref.get()
      const country = businessDoc.get('country') || ''

      const nameMatch = list.some( t => t.name === name )
      const countryMatch = list.some( t => t.country === country )
      const rateMatch = list.some( t => t.rate === rate )
      
      if ( !( nameMatch && countryMatch && rateMatch ) ) { 
        const newTax: GlobalTax = {
          name, rate, country, description,
          slug: `${country}-${slug}`
        }

        list.push( newTax )
        globalTaxesRef.set( { list } );
      }
      

    } catch (error: any) {
      throw console.error(error)
    }
  }

  get appliedTaxesTotal() {
    let total = 0;
    this.applidedTaxes.forEach( t => total += t.amount )
    return total
  }

  leave() {
    this.applidedTaxes = []
  }

  public calcTax(tax: TaxModel, amount: number) {
    let appliedTax = new AppliedTaxModel(tax, amount)
    this.applidedTaxes = this.applidedTaxes.filter(t => t.name != tax.name)
    this.applidedTaxes.push(appliedTax)
    return this.appliedTaxesTotal 
 }
}
