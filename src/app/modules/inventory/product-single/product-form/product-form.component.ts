
import { OnDestroy } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MxLoading } from 'libs/@marxa/devkit/loading/loading.service';
import { MxText } from 'libs/@marxa/devkit/text/mx-text.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip, tap } from 'rxjs/operators';
import { Product, ProductModel } from 'src/app/modules/inventory/products/products.model';
import { InventoryProductsService } from '../../products/products.service';
import { CurrentProductService } from '../current-product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  
  
  // @Input() product?: Product.DataReference;
  @Input() provider?: Product.ProviderReference
  
  
  public productForm: Product.Form 
  public reference_codes: string[] = [];
  public categories: string[] = [];
  public aplicacion_modelos: string[] = [];
  public proveedores_ref: any[] = [];
  public currentStore?: Product.StoreReference;
  
  public validForm: boolean = false;
  
  @Output() update: EventEmitter<Product.UpdateReference> = new EventEmitter();
  @Output() patch: EventEmitter<Product.StockReference> = new EventEmitter();
  @Output() changes: EventEmitter<Product.DataReference> = new EventEmitter();
  
  
  private _storesSubscription!: Subscription;
  private _productFormSubscription: Subscription;
  // private _storesFromSubscription: Subscription;

  constructor(
    private _products: InventoryProductsService,
    private _loading: MxLoading,
    public text: MxText,
    private _formBuilder: FormBuilder,
    public current: CurrentProductService
  ) {

    this.productForm = this._formBuilder.group( {
      product_code: new FormControl('', [Validators.required]),
      reference: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      brand: new FormControl(''),
      measure_unit: new FormControl('Unidad', [Validators.required]),
      provider: new FormControl( '' ),
      third_reference: new FormControl( '' ),
      categories: new FormControl( [] ),
      notes: new FormControl( [] ),
      reference_codes: new FormControl( [] )
    }) as Product.Form;

    this._productFormSubscription = this.productForm
      .valueChanges.pipe(
        skip( 1 ),
        distinctUntilChanged( ( x, y ) => JSON.stringify( x ) == JSON.stringify( y ) ),
        debounceTime( 1000 ),
        tap( changes => {
          console.log( changes )
          this.current.product$.next( { ...changes } )
          // this.changes.emit( changes )
        } ),
        tap( () => this.validForm = this.productFormValid),
      ).subscribe();
    
  }

  ngOnInit(): void {
    const product = this.current.product$.value
    if ( product ) this.productForm.patchValue( { ...product } )
    else this.current.product$.next( new ProductModel() )
    console.log( this.current.product$.value )
  }

  listHasChanged( list:
    | 'reference_codes'
    | 'categories'
    | 'notes'
    | 'gallery',
    value: string[]
  ): void {
    this.productForm.patchValue( { [list]: value})
  }

  get productFormValid() {
    return this.productForm.valid || !this.productForm.pristine;
  }

  onSubmit() {

    /* Si existe store_id es por que el formulario se encuentra en modo arqueo */
    // if (this.store_id) {
      // const store = stores.find((a) => a.store_id === this.store_id)!;

      // let product: ProductModel = new ProductModel(
      //   this.productForm.value['UPC'],
      //   this.productForm.value['reference'],
      //   this.productForm.value['description'],
      //   this.productForm.value['brand'],
      //   this.productForm.value[ 'measure_unit' ],
      // );
      // this.update.emit({ product, lastStoreState: this.currentStore });
    // } else {
      // let product: Partial<ProductModel.DataReference> = {
      //   ...this.productForm.getRawValue(),
      //   categories: this.categories,
      //   reference_codes: [
      //     ...(this.product?.reference_codes || []),
      //     ...this.reference_codes,
      //   ],
      // };
      // this.patch.emit({ product, stores });
    // }

    this.productForm.markAsPristine();
    this.validForm = false;
  }

  ngOnDestroy() {
    this._storesSubscription?.unsubscribe();
    this._productFormSubscription?.unsubscribe();
  }
}

@Component({
  template: `
    <p mat-dialog-title class="center">Agregar producto</p>
    <mat-dialog-content>
      <app-product-form></app-product-form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-raised-button>Cancelar</button>
      <button mat-raised-button color="primary">Aceptar</button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./product-form.component.scss']
})
  
export class ProductFormDialog implements OnInit {
  constructor (
    // @Inject( MAT_DIALOG_DATA ) data: any,
    public dialog: MatDialogRef<ProductFormDialog>
  ) { }
  
  ngOnInit() { }
}