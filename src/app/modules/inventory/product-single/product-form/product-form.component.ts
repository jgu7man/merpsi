
import { OnDestroy } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MxLoading } from 'libs/@marxa/devkit/loading/loading.service';
import { MxText } from 'libs/@marxa/devkit/text/mx-text.service';
import { of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, first, map, skip, tap } from 'rxjs/operators';
import { Product } from 'src/app/models/products.model';
import { CurrentProductService } from '../../services/current-product.service';
import { InventoryProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  
  
  @Input() product?: Product.DataReference;
  
  
  public productForm: Product.Form 
  public reference_codes: string[] = [];
  public categories: string[] = [];
  public aplicacion_modelos: string[] = [];
  public proveedores_ref: any[] = [];
  public currentStore?: Product.StoreReference;
  
  public validForm: boolean = false;
  
  @Output() update: EventEmitter<Product.UpdateReference> = new EventEmitter();
  @Output() patch: EventEmitter<Product.StockReference> = new EventEmitter();
  
  
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
      owner: new FormControl( '' , [Validators.required]),
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
        tap(this.current.product$.next),
        tap( () => this.validForm = this.productFormValid),
      ).subscribe();
    
  }

  ngOnInit(): void {
    if (this.product) {
      this.productForm.patchValue(this.product);

      if (this.product.reference_codes)
        this.reference_codes = this.product.reference_codes;
      if (this.product.categories) this.categories = this.product.categories;
    }
  }


  qrlistChanged( reference_codes: any[] ): void {
    this.productForm.patchValue({reference_codes})
  }

  onCategoriesChanged(categories: any[]): void {
    this.productForm.patchValue( { categories } )
  }

  onNotesChanged( notes: any[] ): void {
    this.productForm.patchValue({notes})
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
    this._storesSubscription.unsubscribe();
    this._productFormSubscription.unsubscribe();
  }
}
