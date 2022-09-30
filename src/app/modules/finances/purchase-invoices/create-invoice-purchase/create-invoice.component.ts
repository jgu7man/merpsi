import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MxAlert, MxCache } from '@marxa/devkit';
import { Observable } from 'rxjs';
import { Product } from 'src/app/modules/inventory/products/products.model';
import firebase from "firebase/app";
import { FireDoc } from 'src/app/models/firestore.model';
import { MatSelectChange } from '@angular/material/select';
import { SelectConceptDialogComponent } from '../../shared/select-concept.dialog/select-concept.dialog.component';
import { InventoryProductsService } from 'src/app/modules/inventory/products/products.service';
import { iSede } from '../../../admin/stores/sede.model';
import { SedesService } from '../../../admin/stores/sedes.service';
import { PurchaseInvoiceService } from '../puchase-invoice.service';
import { iProvider } from 'src/app/modules/inventory/providers/provider.model';
import { DetailsConceptService } from '../../shared/invoice-details/invoice-details.service';
import { PurchaseInvoiceModel } from '../pucharce-invoice.model';
import Swal from 'sweetalert2';
import { ProviderService } from 'src/app/modules/inventory/providers/provider.service';
import { ProductInvoiceModel } from '../../shared/invoice.model';
import { FooterService } from '../../shared/footer-invoice/footer.service';
import { TaxesService } from '../../shared/taxes/taxes.service';



@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit, OnDestroy{

  stores$: Observable<iSede[]>
  businessRef = this._cache.getDataKey( 'eid' )
  @Input() invoice: PurchaseInvoiceModel | null = null


  storeCtrl: FormControl = new FormControl()
  invoiceId: string | null = null
  invoiceForm: FormGroup = new FormGroup({
    action_date: new FormControl('', [Validators.required]),
    invoiceId : new FormControl('', [Validators.required]),
  })

  productList: ProductInvoiceModel[] = []
  providerRef: firebase.firestore.DocumentReference | null = null
  productSelect : FireDoc<Product.DataReference> | null = null
  concept: ProductInvoiceModel | null = null 

  @Output() submited: EventEmitter<any> = new EventEmitter()

  
  constructor(
    public purchase: PurchaseInvoiceService,
    public conceptInvoice: DetailsConceptService,
    private _stores: SedesService,
    private _alert: MxAlert,
    private _dialog: MatDialog,
    private _products: InventoryProductsService,
    private _cache: MxCache,
    private _footer: FooterService,
    private providerServ: ProviderService,
    private _taxes: TaxesService

    
  ) {
    this.stores$ = this._stores.listenAll()
    this.stores$.pipe().subscribe(store => {
      console.log(store)
    })
    
  }

  clean(){
    this.invoiceId = null
    this.conceptInvoice.details$.next([])
    this.conceptInvoice.details_Notes$.next([])
    this.conceptInvoice.details_invoice$.next([])
    this._footer.currentfoot$.next(null)
    this._taxes.applidedTaxes = []
    this.providerServ.providerSelect$.next(null)
    this.storeCtrl.patchValue('')
    this.invoiceForm.patchValue({
      action_date: '',
      invoiceId : '',
    })
  }
  ngOnDestroy(): void {
    this.clean()
    
   }
  
  async ngOnInit() {
    
  }

  onStoreSelected( event: MatSelectChange ) {
    this.purchase.store = event.value
  }

  setProvider( provider: iProvider ) {
    this.purchase.provider = provider;
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

/**
 *Funcion que se encarga validar que el numero de factura 
 * que se esta ingresando no exista en base de datos
 * @param {string} invoiceId
 * @memberof CreateInvoiceComponent
 */
async findInvoice( invoiceId: string ){
  // validacion del numero de caracteres 
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
    try {
       await this.purchase.saveInvoice(this.invoiceForm)
       this._alert.notify('la factura ha sido guardado con exito!')
       this.clean()
       this.submited.emit()
    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
        Swal.fire(error.message)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }
    
    
  }
}
