import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { add } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductModel } from 'src/app/models/products.model';
import { ProviderModel } from 'src/app/models/provider.model';
import { iSede } from 'src/app/models/sede.model';
import { SedesService } from 'src/app/modules/admin/sedes/sedes.service';
import { InventoryProductsService } from 'src/app/modules/inventory/services/products.service';
import { ProviderService } from 'src/app/services/provider.service';
import Swal from 'sweetalert2';
import { ProviderNewDialog } from '../provider-new.dialog/provider-new.dialog';
import firebase from "firebase/app";
import { PuchaseInvoiceService } from 'src/app/services/puchase-invoice.service';
import { ProductPurchasedModel } from 'src/app/models/pucharce-invoice.model';
import { FireDoc } from 'src/app/models/firestore.model';
import { AuthService } from 'src/app/services/auth.service';
import { iManager } from 'src/app/modules/admin/personal/manager.model';


@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {

  stores$: Observable<iSede[]>

  invoiceForm: FormGroup = new FormGroup({
    store: new FormControl('', [Validators.required]),
    provider: new FormControl('', [Validators.required]),
    nameProvider: new FormControl('', [Validators.required]),
    purshase_date: new FormControl('', [Validators.required]),
    invoice_ID : new FormControl('', [Validators.required]),
    payment_method: new FormControl('', [Validators.required]),

  })

  nameProvider: boolean = false;
  productList: ProductPurchasedModel[] = []
  manager: iManager | null = null
  providerRef: firebase.firestore.DocumentReference | null = null
  



  constructor(
    private _provider: ProviderService,
    private _stores: SedesService,
    private _alert: MxAlert,
    private _dialog: MatDialog,
    private _products: InventoryProductsService,
    private _purchase: PuchaseInvoiceService,
    private _auth: AuthService
  ) {
    this.stores$ = this._stores.getAll()
    console.log(this.stores$)
    this.manager = this._auth.userState$.value
  }

  async ngOnInit(): Promise<void> {

  }

  async findProvider(crf: string) {
    if (crf.length >= 8) {
      let providerDoc = await this._provider.findProviderByCRF(crf)
      let provider = providerDoc.data()
      console.log(provider)
      if (provider != null) {
        Swal.fire({
          text: "Proveedor " + provider.businessName.toUpperCase() + " encontrado , Deseas agregarlo a la Factura?",
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'agregar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.nameProvider = true;
            this.providerRef = providerDoc.ref
            this.invoiceForm.patchValue({ nameProvider: provider.businessName });
            this.invoiceForm.controls.nameProvider.disable()

          } 
        })
      } else {
        let businessDoc = await this._provider.findBusinessByCRF(crf)
        if (businessDoc != null) {
          let providerRef = businessDoc.ref
          let providerData = businessDoc.data()

          await Swal.fire({
            text: "Encontramos a este Proveedor: " + providerData.businessName.toUpperCase() + " Deseas agregarlo?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'agregar'
          }).then(async (result) => {
            if (result.isConfirmed) {
              // como obtengo la ref del proveedor que se
              let newProvide = new ProviderModel(providerData.CRF, providerData.country, providerData.name, providerData.businessName, providerData.type, null)
              this.providerRef = await this._provider.create(newProvide, providerRef)
              this.nameProvider = true;
              this.invoiceForm.patchValue({ nameProvider: providerData.businessName });
              this.invoiceForm.controls.nameProvider.disable()
            } else {
              this.openProviderNew()

            }
          })
        } else {
          this.openProviderNew()
        }
      }
    }
  }

  openProviderNew() {
    this._dialog.open(ProviderNewDialog, {
      maxWidth: '100%',
      data: {
        crf: this.invoiceForm.controls.provider.value

      }
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
      return await this._products.findProductBusiness(code);

    } catch (error: any) {
      this._alert.error('ha ocurrido un error ', error)
      return null
    }

  }

  add(
    product: FireDoc<ProductModel>,
    cant: number,
    amount: number
  ) {
    this.productList.push(this._purchase.addProduct(product, cant, amount))
  }
  
  delete(index: number) {
    this.productList.splice(index, 1)
  }


  save(){

  }
}
