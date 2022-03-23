import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { ProductModel } from 'src/app/models/products.model';
import { CurrentProductService } from '../../services/current-product.service';

@Component({
  selector: 'app-product-stored-form',
  templateUrl: './product-stored-form.component.html',
  styleUrls: ['./product-stored-form.component.scss']
})
export class ProductStoredFormComponent implements OnInit {

  @Input() store_id?: string
  public productStoredForm: ProductModel.StoreReference.StoreForm
  

  constructor (
    public current: CurrentProductService
  ) { 
    this.productStoredForm = new FormGroup( {
      store_id: new FormControl('', [Validators.required]),
      product_code: new FormControl('', [Validators.required]),
      stock: new FormControl(0, [Validators.required]),
      unit_price: new FormControl(0, [Validators.required]),
      unit_cost: new FormControl(0, [Validators.required]),
      min_required: new FormControl(0, [Validators.required]),
      bookshelves: new FormControl([], [Validators.required]),
      provider: new FormControl(''),
    } ) as ProductModel.StoreReference.StoreForm
    
    /* Actualiza automáticamente los cambios en el array de stores */
    this.productStoredForm.valueChanges.pipe(
      distinctUntilChanged( ( x, y ) => JSON.stringify( x ) == JSON.stringify(y)),
      debounceTime( 1000 ),
      map( this.current.updateStore ),
      tap( () => this.current.formValid$.next( {
        [ this.store_id! ]: this.productStoredForm.valid || !this.productStoredForm.pristine
      } ) )
    ).subscribe()
  }

  ngOnInit(): void {
    if ( this.store_id ) {
      const current_store = this.current.storage$
        .value.find( s => s.store_id === this.store_id )
      
      if ( current_store )
        this.productStoredForm.patchValue( current_store )
    }
  }

  get bookshelves(): string[] {
    return this.productStoredForm.value.bookshelves
  }

  set bookshelves( value: string[] ) {
    this.productStoredForm.controls.bookshelves.patchValue(value)
  }

}
