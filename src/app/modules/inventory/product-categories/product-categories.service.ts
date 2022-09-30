import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MxAlert, MxCache, MxLoading } from '@marxa/devkit';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DatabasePathsService } from 'src/app/services/database-paths.service';
import { ProductCategory } from './product-category.model';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoriesService {

  list$ = new BehaviorSubject<ProductCategory[]>( [] )
  businessCRF: string = this._cache.getDataKey( 'eid' )!

  constructor (
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _loading: MxLoading,
    private _alert: MxAlert,
    private _path: DatabasePathsService
  ) { 
    this.listenList().subscribe()
  }

  get ref() {
    try {
      if ( !this.businessCRF ) throw { message: 'No se pudo encontrar el id de la empresa' }
      const path: string = this._path.productCategoriesRef
      return this._afs.doc<ProductCategory.list>(path)
    } catch ( error ) {
      throw error
    }
  }

  private listenList() {
    return this.ref.valueChanges().pipe(
      map( doc => {
        let list = doc?.list || []
        return list.sort( ( a, b ) => {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          return 0;
        })
      } ),
      tap((list) => this.list$.next(list))
    )
  }

  async add(
    {name, description, subcategories}: ProductCategory.data,
  ) {
    this._loading.spinner('open')
    
    try {
      const list = this.list$.value

      const category = new ProductCategory( list.length, name, description, subcategories )
      list.push( {...category} )
      
      /* Guardado en firestore */
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

  async update(
    value: ProductCategory,
  ) {
    try {
      this._loading.spinner('open')
      const list = this.list$.value
      list[ value.index ] = value

      /* Guardado en firestore */
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

  async delete( index: number, parentIndex?: number ) {
    try {
      this._loading.spinner('open')
      const list = this.list$.value

      if ( parentIndex !== undefined ) {
        let parentCategory = list[ parentIndex ]
        parentCategory.subcategories.splice( index, 1 )
        list[ parentIndex ] = parentCategory
      } else {
        list.splice( index, 1 )
      }

      
      /* Borrado en firestore */
      await this.ref.update( { list } )
      
      this._loading.spinner( 'close' )
      this._alert.notify( `${parentIndex !== undefined ? 'Subcategoría' : 'Categoría'} eliminada` )
      
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
