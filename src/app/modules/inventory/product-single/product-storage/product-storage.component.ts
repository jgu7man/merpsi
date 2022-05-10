import { Component, OnDestroy, OnInit } from '@angular/core';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MenuItem } from 'primeng/api';
import { from, Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CountingsService } from '../../countings/countings.service';
import { StoreReferenceModel } from '../../products/products.model';
import { CurrentProductService } from '../current-product.service';

@Component({
  selector: 'app-product-storage',
  templateUrl: './product-storage.component.html',
  styleUrls: ['./product-storage.component.scss']
})
export class ProductStorageComponent implements OnInit, OnDestroy {

  items: MenuItem[] = [];
  readonly storage: StoreReferenceModel[] = []
  private _storageSubscription: Subscription

  constructor (
    public current: CurrentProductService,
    public counting: CountingsService,
    private _alert: MxAlert
  ) {
    this.items = [
      { label: 'Eliminar todo', icon: 'pi pi-minus-circle', command: () => {
          this.deleteWhole();
        }
      },
    ]

    /* Update storage */
    this._storageSubscription = this.current.storage$.pipe(
      mergeMap( storage => from( storage ) ),
      map( store => {
        let indexStore = this.storage.findIndex( store => store.store_id === store.store_id )
        if ( indexStore < 0 ) this.storage[ this.storage.length ] = store
        else this.storage.map( (s, i) => i === indexStore ? store : s )
      } )
    ).subscribe()
  }

  ngOnInit(): void { }


  deleteCurrent() {
    try {
      if ( !this.counting.current )
        throw { message: 'No es posible eliminar sin estar en modo arqueo' }
      if ( !this.current.product$.value )
        throw { message: 'No es posible eliminar sin estar seleccionado un producto' }

      const stores = this.current.storage$.value
      const currentStore = stores.find( store => store.store_id === this.counting.current!.store_id )

      if ( !currentStore )
        throw { message: 'No es posible eliminar un producto sin existencia en este almacen' }

      this.counting.registDeleting(
        this.current.product$.value.UPC,
        currentStore
      )

      return
    } catch (error: any) {
      if ( 'message' in error ) this._alert.error(error.message, error)
      else this._alert.error('No es posible eliminar el producto', error)

      return console.error(error)
    }
  }

  deleteWhole() {
    try {
      if ( !this.counting.current )
        throw { message: 'No es posible eliminar sin estar en modo arqueo' }
      if ( !this.current.product$.value )
        throw { message: 'No es posible eliminar sin estar seleccionado un producto' }

      this.counting.registDeleteAll( this.current.product$.value.UPC )
    } catch ( error: any ) {
      if ( 'message' in error ) this._alert.error( error.message, error )
      else this._alert.error( 'No es posible eliminar el producto', error )

      return console.error( error )
    }
  }

  ngOnDestroy(): void {
    this._storageSubscription?.unsubscribe()
  }

}
