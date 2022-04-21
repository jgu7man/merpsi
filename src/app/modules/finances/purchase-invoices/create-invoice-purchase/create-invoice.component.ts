import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { Observable } from 'rxjs';
import { Product } from 'src/app/modules/inventory/products/products.model';
import  Swal from 'sweetalert2';
import firebase from "firebase/app";
import { FireDoc } from 'src/app/models/firestore.model';
import { AuthService } from 'src/app/services/auth.service';
import { MatSelectChange } from '@angular/material/select';
import { InvoiceStore, ProductInvoiceModel } from 'src/app/modules/finances/invoices/invoice.model';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { debounceTime, distinctUntilChanged, first, skip } from 'rxjs/operators';
import { SelectConceptDialogComponent } from '../../invoices/select-concept.dialog/select-concept.dialog.component';
import { iManager } from 'src/app/modules/admin/managers/manager.model';
import { InventoryProductsService } from 'src/app/modules/inventory/products/products.service';
import { iSede } from '../../../admin/stores/sede.model';
import { SedesService } from '../../../admin/stores/sedes.service';
import { PurchaseInvoiceService } from '../puchase-invoice.service';
import { iProvider, ProviderModel } from '../../../inventory/providers/provider.model';
import { ProviderNewDialog } from '../provider-new.dialog/provider-new.dialog';
import { ProviderService } from '../../../inventory/providers/provider.service';


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
      debounceTime( 500 ),
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
    console.log( store )
    this.storeForm.patchValue( {
      id: store.id!,
      name: store.name  
    })
  }

  setProvider( provider: any ) {
    console.log( provider )
    this.providerForm.patchValue( {
      businessName: provider.businessName,
      CRF: provider.CRF,
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
        // console.log(this.purchase.current$.value)
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
