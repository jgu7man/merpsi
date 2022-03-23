import { COMMA, TAB } from '@angular/cdk/keycodes';
import { OnDestroy } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MxLoading } from 'libs/@marxa/devkit/loading/loading.service';
import { MxText } from 'libs/@marxa/devkit/text/mx-text.service';
import { of, Subscription } from 'rxjs';
import { first, skip } from 'rxjs/operators';
import { ProductModel } from 'src/app/models/products.model';
import { InventoryProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  
  
  @Input() product?: ProductModel.DataReference;
  @Input() store_id?: string;
  public storesForm: FormArray = new FormArray([]);
  public productForm: ProductModel.Form 
  public reference_codes: string[] = [];
  public categories: string[] = [];
  public aplicacion_modelos: string[] = [];
  public proveedores_ref: any[] = [];
  public currentStore?: ProductModel.StoreReference;
  
  public enableForm: boolean = false;
  
  @Output() update: EventEmitter<ProductModel.UpdateReference> = new EventEmitter();
  @Output() patch: EventEmitter<ProductModel.StockReference> = new EventEmitter();
  
  readonly separatorKeysCodes = [ COMMA, TAB ] as const;
  private _storesSubscription!: Subscription;
  private _productFormSubscription: Subscription;
  private _storesFromSubscription: Subscription;

  constructor(
    private _products: InventoryProductsService,
    private _loading: MxLoading,
    public text: MxText,
    private _formBuilder: FormBuilder
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
    }) as ProductModel.Form;

    this._productFormSubscription = this.productForm.valueChanges
      .pipe(skip(1))
      .subscribe(() => {
        this.enableForm = true;
      });
    this._storesFromSubscription = this.storesForm.valueChanges
      .pipe(skip(1))
      .subscribe(() => {
        this.enableForm = true;
      });
  }

  ngOnInit(): void {
    this.setAlmacenes();
    if (this.product) {
      this.productForm.patchValue(this.product);

      if (this.product.reference_codes)
        this.reference_codes = this.product.reference_codes;
      if (this.product.categories) this.categories = this.product.categories;
      // if ( this.product.aplicacion_modelos ) this.aplicacion_modelos = this.product.aplicacion_modelos

      // if (!this.store_id) {
      //   this.productForm.controls['costoUnitario'].disable();
      // }
    }
  }

  setAlmacenes() {
    this._storesSubscription = (
      !this.product
        ? of(<ProductModel.StoreReference[]>[])
        : this._products.retriveStoresRef(this.product.UPC)
    )
      .pipe(first())
      .subscribe(async (stores) => {
        // if (this.product && 'almacen' in this.product)
        //   stores.push(this.product.almacen)

        // console.log( almacenes )
        await this._loading.asyncForEach(stores, (store) => {
          // console.log( almacen )
          this.storesForm.push(
            new FormGroup({
              // product_code: new FormControl( store.product_code ),
              product_code: new FormControl(
                this.product?.UPC || store.product_code
              ),
              stock: new FormControl(
                {
                  value: store.stock,
                  disabled: this.store_id !== store.store_id || !this.store_id,
                },
                [Validators.required]
              ),
              bookshelves: new FormControl(store.bookshelves),
              min_required: new FormControl(0),
            })
          );
        });

        // console.log( this.almacenId )
        if (this.store_id) {
          this.currentStore = stores.find((a) => a.store_id === this.store_id);
          if (!this.currentStore) {
            this.storesForm.push(
              new FormGroup({
                store_id: new FormControl(this.store_id),
                product_code: new FormControl(this.product?.UPC || ''),
                stock: new FormControl(0, [Validators.required]),
                bookshelves: new FormControl([]),
                min_required: new FormControl(0),
              })
            );
          }
        }

        // console.log( this.almacenesForm.length, this.almacenesForm.value )
        // console.log( this.almacenesForm.getRawValue() )
      });
  }

  qrlistChanged(qrcodes: any): void {
    this.reference_codes = qrcodes;
    this.enableForm = true;
  }

  addItem(event: MatChipInputEvent, list: 'modelos' | 'categories'): void {
    const value = (event.value || '').trim();
    if (value !== '') {
      if (list == 'categories') {
        this.categories.push(value);
      } else {
        this.aplicacion_modelos.push(value);
      }
      event.input.value = '';
      this.enableForm = true;
    }
  }

  removeItem(item: string, list: 'modelos' | 'categories'): void {
    if (list === 'categories') {
      let index = this.categories.indexOf(item);
      if (index >= 0) {
        this.categories.splice(index, 1);
      }
    } else {
      let index = this.aplicacion_modelos.indexOf(item);
      if (index >= 0) {
        this.aplicacion_modelos.splice(index, 1);
      }
    }

    this.enableForm = true;
  }

  addOnEstanteria(event: MatChipInputEvent, index: number): void {
    if (event.value !== '') {
      const current = this.storesForm.at(index);
      const estanterias: string[] = current.value['estanterias'];
      estanterias.push(event.value);
      this.storesForm.at(index).patchValue({ estanterias });
      event.input.value = '';
    }
  }

  removeOnEstanteria(item: string, index: number): void {
    const current = this.storesForm.at(index);
    const estanterias: string[] = current.value['estanterias'];
    const itemIndex = estanterias.indexOf(item);
    estanterias.splice(itemIndex, 1);
    this.storesForm.at(index).patchValue({ estanterias });
  }

  onSubmit() {
    const stores = this.storesForm.getRawValue() as ProductModel.StoreReference[];

    if (this.store_id) {
      const store = stores.find((a) => a.store_id === this.store_id)!;

      let product: ProductModel = new ProductModel(
        this.productForm.value['UPC'],
        this.productForm.value['reference'],
        this.productForm.value['description'],
        this.productForm.value['brand'],
        this.productForm.value[ 'measure_unit' ],
      );
      this.update.emit({ product, lastStoreState: this.currentStore });
    } else {
      let product: Partial<ProductModel.DataReference> = {
        ...this.productForm.getRawValue(),
        categories: this.categories,
        reference_codes: [
          ...(this.product?.reference_codes || []),
          ...this.reference_codes,
        ],
      };
      this.patch.emit({ product, stores });
    }

    this.productForm.markAsPristine();
    this.storesForm.markAsPristine();
    this.enableForm = false;
  }

  ngOnDestroy() {
    this._storesSubscription.unsubscribe();
    this._productFormSubscription.unsubscribe();
    this._storesFromSubscription.unsubscribe();
  }
}
