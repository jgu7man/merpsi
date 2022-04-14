import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/products.model';
import { iSede } from 'src/app/models/sede.model';
import { SedesService } from 'src/app/modules/admin/sedes/sedes.service';
import { InventoryProductsService } from 'src/app/modules/inventory/services/products.service';
import { ProviderService } from 'src/app/services/provider.service';
import  Swal from 'sweetalert2';
import { ProviderNewDialog } from '../provider-new.dialog/provider-new.dialog';
import firebase from "firebase/app";
import { PurchaseInvoiceService } from 'src/app/services/puchase-invoice.service';
import { FireDoc } from 'src/app/models/firestore.model';
import { AuthService } from 'src/app/services/auth.service';
import { iManager } from 'src/app/modules/admin/personal/manager.model';
import { MatSelectChange } from '@angular/material/select';
import { InvoiceStore, ProductInvoiceModel } from 'src/app/models/invoice.model';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { iProvider, ProviderModel } from 'src/app/models/provider.model';
import { debounceTime, distinctUntilChanged, first, skip } from 'rxjs/operators';
import { SelectConceptDialogComponent } from './select-concept.dialog/select-concept.dialog.component';


@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {

  stores$: Observable<iSede[]>
  businessRef = this._cache.getDataKey( 'eid' )
  
  storeForm: FormGroup = new FormGroup( {
    id: new FormControl( '', [ Validators.required ] ),
    name: new FormControl( '', [ Validators.required])
  } )
  
  providerForm: FormGroup = new FormGroup( {
    CRF: new FormControl( '', [ Validators.required ] ),
    businessName: new FormControl('', [Validators.required]),
  })

  invoiceForm: FormGroup = new FormGroup({
    store: this.storeForm,
    provider: this.providerForm,
    document_date: new FormControl('', [Validators.required]),
    invoice_ID : new FormControl('', [Validators.required]),
    payment_method: new FormControl('', [Validators.required]),
  })

  productList: ProductInvoiceModel[] = []
  manager: iManager | null = null
  providerRef: firebase.firestore.DocumentReference | null = null
  productSelect : FireDoc<Product.DataReference> | null = null
  
  constructor(
    private _provider: ProviderService,
    private _stores: SedesService,
    private _alert: MxAlert,
    private _dialog: MatDialog,
    private _products: InventoryProductsService,
    private _cache: MxCache,
    private _auth: AuthService,
    public purchase: PurchaseInvoiceService,
    
  ) {
    this.stores$ = this._stores.listenAll()
    this.manager = this._auth.userState$.value
  }
  
  async ngOnInit(): Promise<void> {
    this.invoiceForm.valueChanges.pipe(
      distinctUntilChanged( ( x, y ) => JSON.stringify( x ) == JSON.stringify(y)),
      debounceTime( 5000 ),
      skip(1)
    ).subscribe( changes => {
      this.purchase.current$.next( {
        ...this.purchase.current$.value,
        ...changes
      } )
      console.log( this.purchase.current$.value)
    })
  }

  onStoreSelected( event: MatSelectChange ) {
    const store: iSede = event.value
    this.storeForm.patchValue( {
      id: store.id!,
      name: store.name  
    })
    // this.purchase.updateCurrent( 'store', {
    //   id: store.id!,
    //   name: store.name
    // } )
  }

  get provider() {
    return this.providerForm.value
  }

  async findProvider() {
    // let provider = this.invoiceForm.controls.provider as FormGroup
    let crf = this.provider.CRF

    if (crf.length >= 8) {
      
      let provider = await this._provider.findProviderByCRF( crf )
      console.log( provider )
      
      if (provider) {
        let message = `Proveedor ${provider.businessName.toUpperCase()} encontrado , Deseas agregarlo a la Factura?`
        const result = await this.alertProviderFinded( message )
        
        if (result.isConfirmed) {
          // this.purchase.updateCurrent( 'provider', {
          //   CRF: provider.CRF,
          //   businessName: provider.businessName
          // } )
          this.providerForm.patchValue( {
            businessName: provider.businessName,
            CRF: provider.CRF,
          })
        } 

      } else {
        let business = await this._provider.findBusinessByCRF(crf)
        if (business != null) {

          const message = `Encontramos a este Proveedor: ${business.businessName.toUpperCase()}  Deseas agregarlo?`;
          const result = await this.alertProviderFinded( message)
            
          if ( result.isConfirmed ) {
            // this.purchase.updateCurrent( 'provider', {
            //   CRF: business.CRF,
            //   businessName: business.businessName
            // })
            this.providerForm.patchValue( {
              businessName: business.businessName,
              CRF: business.CRF,
            })
          } else {
            this.openProviderNew()
          }
        } else {
          this.openProviderNew()
        }
      }
    }
  }

  private async alertProviderFinded(message: string){
    return Swal.fire({
      text: message,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'agregar'
    })
  }

  openProviderNew() {
    this._dialog.open(ProviderNewDialog, {
      maxWidth: '100%',
      data: {
        crf: this.providerForm.value
      }
    } ).afterClosed().pipe( first() ).subscribe( (provider: ProviderModel) => {
      // this.purchase.updateCurrent( 'provider', {
      //   CRF: provider.CRF,
      //   businessName: provider.businessName
      // })
      this.providerForm.patchValue( {
        businessName: provider.businessName,
        CRF: provider.CRF,
      })
    })
  }

/**
 *
 * Funcion que se encarga de buscar un producto y agregarlo a la lista de productos
 * @param {string} code
 * @memberof CreateInvoiceComponent
 */
  async findProduct(code: string) {
    try {
     this.productSelect = await this._products.findProductBusiness(code);
    } catch (error: any) {
      this._alert.error('ha ocurrido un error ', error)
    }

  }


  async findInvoice( invoice_id: string ){
    if (invoice_id.length>5){
      const validation = await this.purchase.findInvoice( invoice_id )
      if (validation) {
        this.invoiceForm.controls.invoice_ID.setErrors( { exist: true } )
      } else {
        console.log(this.purchase.current$.value)
        this.purchase.updateCurrent('invoice_ID',invoice_id)
      }
    }
  }

  getValue(provider_seleted: iProvider){
    this.invoiceForm.patchValue({
      businessName: provider_seleted.businessName,
      provider: provider_seleted.CRF
    })
    this.purchase.updateCurrent( 'provider', {
      CRF: provider_seleted.CRF,
      businessName: provider_seleted.businessName
    })

    this.invoiceForm.controls.businessName.disable()
  }

  addConcept(){
    
    this._dialog.open(SelectConceptDialogComponent, {
      width: '600px ',
    } )
    //this.purchase.addConcept()
  }
}
