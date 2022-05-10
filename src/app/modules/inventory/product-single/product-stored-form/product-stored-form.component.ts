import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { Product, StoreReference, StoreReferenceModel } from 'src/app/modules/inventory/products/products.model';
import { CountingsService } from '../../countings/countings.service';
import { CurrentProductService } from '../current-product.service';

@Component({
  selector: 'app-product-stored-form',
  templateUrl: './product-stored-form.component.html',
  styleUrls: ['./product-stored-form.component.scss']
})
export class ProductStoredFormComponent implements OnInit {

  @Input() store_id?: string
  public current_state?: StoreReferenceModel
  public current_stock: number = 0
  public productStoredForm: StoreReference.StoreForm


  constructor (
    public current: CurrentProductService,
    public balancing: CountingsService
  ) {

    let disabled = this.balancing.current?.store_id !== this.store_id
    this.productStoredForm = new FormGroup( {
      store_id: new FormControl('', [Validators.required]),
      product_code: new FormControl('', [Validators.required]),
      stock: new FormControl({value: 0, disabled }, [Validators.required]),
      unit_price: new FormControl({value: 0, disabled }, [Validators.required]),
      unit_cost: new FormControl({value: 0, disabled }, [Validators.required]),
      min_required: new FormControl(0, [Validators.required]),
      bookshelves: new FormControl([], [Validators.required]),
      provider: new FormControl(''),
    } ) as StoreReference.StoreForm

    /* Actualiza automáticamente los cambios en el array de stores */
    this.productStoredForm.valueChanges.pipe(
      distinctUntilChanged( ( x, y ) => JSON.stringify( x ) == JSON.stringify(y)),
      debounceTime( 1000 ),
      map( (store: StoreReferenceModel ) => {
        let {min_required, bookshelves, store_id } = store
        this.current.updateStore( { min_required, bookshelves }, store_id )

        if ( this.balancing.current ) {
          const stored = this.current.product$.value!.stored

          this.balancing.registUpdateRecord( store.UPC, {
            ...store,
            stock: this.current_state!.stock,
            stock_update: store.stock,
          }, !stored )
        }
      }),
      tap( () => this.current.formValid$.next( {
        ...this.current.formValid$.value,
        [ this.store_id! ]: this.productStoredForm.valid || !this.productStoredForm.pristine
      } ) )
    ).subscribe()
  }

  ngOnInit(): void {
    if ( this.store_id ) {
      this.current_state = this.current.storage$
        .value.find( s => s.store_id === this.store_id )

      if ( this.current_state ) {
        this.current_stock = this.current_state.stock
        this.productStoredForm.patchValue( {
          ...this.current_state,
        })
      }
    }
  }

  get bookshelves(): string[] {
    return this.productStoredForm.value.bookshelves
  }

  set bookshelves( value: string[] ) {
    this.productStoredForm.controls.bookshelves.patchValue(value)
  }

}
