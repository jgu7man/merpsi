import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MxLoading } from 'libs/@marxa/devkit/loading/loading.service';
import { MxText } from 'libs/@marxa/devkit/text/mx-text.service';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { listenChanges } from 'src/app/models/operators-chains.model';
import { Product, ProductModel } from 'src/app/modules/inventory/products/products.model';
import { ProductCategoriesService } from '../../product-categories/product-categories.service';
import { ProductCategory } from '../../product-categories/product-category.model';
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
  public categories: ProductCategory.selected[] = [];
  public aplicacion_modelos: string[] = [];
  public proveedores_ref: any[] = [];
  public currentStore?: Product.StoreReference;
  
  public validForm: boolean = false;
  
  private _productFormSubscription: Subscription;
  private _submitedSubscription: Subscription;

  constructor(
    public text: MxText,
    private _formBuilder: FormBuilder,
    public current: CurrentProductService,
    public $categories: ProductCategoriesService
  ) {

    this.productForm = this._formBuilder.group( {
      UPC: new FormControl('', [Validators.required]),
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
        listenChanges(1000),
      ).subscribe( changes => {
        this.current.product$.next( {
          ...this.current.product$.value,
          ...changes
        } )
        this.validForm = this.productFormValid
        // this.changes.emit( changes )
      });
    
    this._submitedSubscription = this.current.submited$
      .subscribe( () => {
        this.productForm.markAsPristine();
        this.validForm = false;
    })
  }

  ngOnInit(): void {  
    const product = this.current.product$.value
    if ( product ) this.productForm.patchValue( { ...product } )
    else this.current.product$.next( new ProductModel() )
  }

  listHasChanged( list:
    | 'reference_codes'
    | 'categories'
    | 'notes'
    | 'gallery',
    value: (string | ProductCategory.selected)[]
  ): void {
    this.productForm.patchValue( { [list]: value})
  }

  get productFormValid() {
    return this.productForm.valid || !this.productForm.pristine;
  }

  ngOnDestroy() {
    this._productFormSubscription?.unsubscribe();
    this._submitedSubscription?.unsubscribe();
    this.current.leave()
  }

  
}

@Component({
  template: `
    <p mat-dialog-title class="center">Agregar producto</p>
    <mat-dialog-content>
      <app-product-form></app-product-form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <div class="row">
        <div class="col s12 center">
          <button
            mat-raised-button
            color="primary"
            [disabled]="!(current.formValid | async)"
            (click)="onSubmit()"
            >
              Guardar
          </button>
        </div>
      </div>
    </mat-dialog-actions>
  `,
  styleUrls: ['./product-form.component.scss']
})
  
export class ProductFormDialog implements OnInit {
  
  constructor (
    // @Inject( MAT_DIALOG_DATA ) data: any,
    public dialog: MatDialogRef<ProductFormDialog>,
    public current: CurrentProductService
  ) { }
  
  ngOnInit() { }

  onSubmit() {
    this.current.save()
      .then((productDoc) => this.dialog.close(productDoc))
      .catch(() => this.dialog.close(false))
  }
}


