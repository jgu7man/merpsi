import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, skip, tap } from 'rxjs/operators';
import { StoreReference, StoreReferenceModel } from 'src/app/modules/inventory/products/products.model';
import { CountingsService } from '../../countings/countings.service';
import { CurrentProductService } from '../current-product.service';

@Component({
  selector: 'app-product-stored-form',
  templateUrl: './product-stored-form.component.html',
  styleUrls: ['./product-stored-form.component.scss']
})
export class ProductStoredFormComponent implements OnInit, OnDestroy {

  // @Input() store_id?: string
  @Input() store?: StoreReferenceModel
  public current_stock: number = 0
  public productStoredForm!: StoreReference.StoreForm

  private _submitedSubscription?: Subscription;

  constructor (
    public current: CurrentProductService,
    public countings: CountingsService
  ) {
    console.log( 'new' )
  }

  ngOnInit(): void {
    this.createForm()
    if ( this.store ) {
      this.productStoredForm.patchValue( {
        ...this.store,
      } )
      this.productStoredForm.markAsPristine()
    }
  }

  createForm() {

    let disabled = this.countings.current?.store_id !== this.store!.store_id
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
      skip(this.store ? 1 : 0),
      distinctUntilChanged( ( x, y ) => JSON.stringify( x ) == JSON.stringify(y)),
      debounceTime( 1000 ),
      map( (store: StoreReferenceModel ) => {
        let { store_id } = store
        this.current.updateStore( store, store_id )
      }),
      tap( () => {
        this.current.storeFormsValidation$.next( {
        ...this.current.storeFormsValidation$.value,
        [ this.store!.store_id ]: this.productStoredForm.valid || !this.productStoredForm.pristine
        } )
        console.log( this.current.storeFormsValidation$.value )
      } )
    ).subscribe()

    this._submitedSubscription = this.current.submited$
      .subscribe( () => this.productStoredForm.markAsPristine())
  }

  get bookshelves(): string[] {
    return this.productStoredForm.value.bookshelves
  }

  set bookshelves( value: string[] ) {
    this.productStoredForm.controls.bookshelves.patchValue(value)
  }

  ngOnDestroy(): void {
    this._submitedSubscription?.unsubscribe()
  }

}
