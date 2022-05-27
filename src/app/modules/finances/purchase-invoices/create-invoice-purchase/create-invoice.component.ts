import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { Observable } from 'rxjs';
import { Product } from 'src/app/modules/inventory/products/products.model';
import firebase from "firebase/app";
import { FireDoc } from 'src/app/models/firestore.model';
import { AuthService } from 'src/app/services/auth.service';
import { MatSelectChange } from '@angular/material/select';
import { Invoice, InvoiceFooter, ProductInvoiceModel } from 'src/app/modules/finances/invoices/invoice.model';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { SelectConceptDialogComponent } from '../../invoices/select-concept.dialog/select-concept.dialog.component';
import { iManager } from 'src/app/modules/admin/managers/manager.model';
import { InventoryProductsService } from 'src/app/modules/inventory/products/products.service';
import { iSede } from '../../../admin/stores/sede.model';
import { SedesService } from '../../../admin/stores/sedes.service';
import { PurchaseInvoiceService } from '../puchase-invoice.service';
import { QueryProvider } from 'src/app/modules/inventory/providers/provider.model';
import { InvoiceConceptService } from '../../invoices/invoice-concept/invoice-concept.service';
import { PurchaseInvoiceModel } from '../pucharce-invoice.model';
import { FooterService } from '../../invoices/footer-invoice/footer.service';
import { PersonalService } from 'src/app/modules/admin/managers/personal.service';


@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {

  stores$: Observable<iSede[]>
  businessRef = this._cache.getDataKey( 'eid' )
  
  provider: Invoice.provider | null = null
  store: Invoice.store | null = null
  invoiceId: string | null = null
  invoiceForm: FormGroup = new FormGroup({
    action_date: new FormControl('', [Validators.required]),
    invoiceId : new FormControl('', [Validators.required]),
   // payment_method: new FormControl('', [Validators.required]),
  })

  productList: ProductInvoiceModel[] = []
  providerRef: firebase.firestore.DocumentReference | null = null
  productSelect : FireDoc<Product.DataReference> | null = null
  concept: ProductInvoiceModel | null = null 

  @Output() submited: EventEmitter<any> = new EventEmitter()

  
  constructor(
    public purchase: PurchaseInvoiceService,
    public conceptInvoice: InvoiceConceptService,
    private _stores: SedesService,
    private _alert: MxAlert,
    private _dialog: MatDialog,
    private _products: InventoryProductsService,
    private _cache: MxCache,
    private _auth: AuthService,
    private _footer: FooterService,
    private _manager: PersonalService,

    
  ) {
    this.stores$ = this._stores.listenAll()
    this.stores$.pipe().subscribe(store => {
      console.log(store)
    })
    
  }
  
  async ngOnInit() {
    
  }

  onStoreSelected( event: MatSelectChange ) {
    const store: iSede = event.value
    this.store = {
      id: store.id!,
      name: store.name,
      ref: null // !! preguntar
    }

    console.log(this.store);
    
    
  }

  setProvider( provider: QueryProvider ) {
    console.log( provider )
    this.provider = {
      id: provider.CRF,
      name: provider.businessName,
      ref: null //!preguntar a jorge
    }
    console.log(this.provider);
    
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


  async findInvoice( invoiceId: string ){
    if (invoiceId.length>5){
      const validation = await this.purchase.findInvoice( invoiceId )
      if (validation) {
        this.invoiceForm.controls.invoiceId.setErrors( { exist: true } )
      } else {
        this.invoiceId = invoiceId
      }
    }
  }

  addConcept() {
    this._dialog.open(SelectConceptDialogComponent, {
      width: '600px ',
    }).afterClosed().subscribe(concept => {
      if (concept){
        this.purchase.addConcept(concept)
        this.concept = concept
      }
    })
  }

  async saveInvoice(){
    console.log(this.invoiceForm.value);
    if ( !this.conceptInvoice.details$.value ) throw { message: ' No existe los conceptos'}
    if ( !this._footer.currentfoot$.value ) throw { message: ' No existe el footer'}
    if ( !this._manager.current) throw { message: 'No se ha iniciado la sesion'}

    
    if (this.invoiceForm.valid && this.store && this.provider && this.conceptInvoice.details$.value.length>0){

      const manager: Invoice.manager = {
        id: this._manager.current.uid!,
        name: this._manager.current.name,
        ref: this._manager.managerRef
      }

      let {action_date, invoiceId} = this.invoiceForm.value
      const purchase = new PurchaseInvoiceModel(
        invoiceId,
        action_date,
        this.provider,
        this.store,
        this.conceptInvoice.details$.value,
        this._footer.currentfoot$.value.data,
        undefined,
        undefined,
        manager
      )

      console.log(purchase)

      // let taxs: any = []
      // invoice.footer.taxes.map(tax => {
      //   taxs.push({...tax})
      // })
      // invoice.footer.taxes = taxs
       await this.purchase.saveInvoice(purchase)
      // this._alert.notify('la factura ha sido guardado con exito!')
      // this.submited.emit()
    }else{
      this._alert.message('Debe llenar todos los campos requeridos','text')
      console.log(this.invoiceForm.controls);
      
    }
    
  }
}
