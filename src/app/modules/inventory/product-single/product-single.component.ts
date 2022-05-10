import { Component, OnInit } from '@angular/core';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MenuItem } from 'primeng/api';
import { ArqueosService } from '../countings/arqueos.service';
import { CurrentProductService } from './current-product.service';

@Component({
  selector: 'app-product-single',
  templateUrl: './product-single.component.html',
  styleUrls: ['./product-single.component.scss']
})
export class ProductSingleComponent implements OnInit {

  items: MenuItem[] = [];

  constructor (
    public current: CurrentProductService,
    public counting: ArqueosService,
    private _alert: MxAlert
  ) {
    this.items = [
      { label: 'Eliminar todo', icon: 'pi pi-times', command: () => {
          this.deleteWhole();
        }
      },
    ]
  }

  ngOnInit(): void {
  }

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

}
