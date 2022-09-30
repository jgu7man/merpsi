import { Component, OnInit } from '@angular/core';
import { MxIndex, mxIndexCenterMessage } from '@marxa/index';
import { PurchaseInvoiceModel } from 'src/app/modules/finances/purchase-invoices/pucharce-invoice.model';
import { iSede } from '../../admin/stores/sede.model';
import { SedesService } from '../../admin/stores/sedes.service';
import { ProviderModel } from '../../inventory/providers/provider.model';
import { ProviderService } from '../../inventory/providers/provider.service';
import { FooterService } from '../shared/footer-invoice/footer.service';
import { DetailsConceptService } from '../shared/invoice-details/invoice-details.service';
import { InvoiceFooter } from '../shared/invoice.model';
import { TaxesService } from '../shared/taxes/taxes.service';
import { PurchaseInvoiceService } from './puchase-invoice.service';

@Component({
  selector: 'app-purchase-invoices',
  templateUrl: './purchase-invoices.component.html',
  styleUrls: ['./purchase-invoices.component.scss']
})
export class PurchaseInvoicesComponent implements OnInit {

  providers: ProviderModel[] = [];
  stores: iSede[] = [];
  listPuchases: PurchaseInvoiceModel[] = [];
  centerMessage: mxIndexCenterMessage ={
    showing: 'Mostrando',
    from: 'del',
    to: 'al'
  }
  constructor(
    public purchases: PurchaseInvoiceService,
    private _provider: ProviderService,
    private _stores : SedesService,
    private _taxes: TaxesService,
    private conceptInvoice: DetailsConceptService,
    private _footer: FooterService,
    private providerServ: ProviderService,
    private _index: MxIndex


  ) {
    this._index.collection = `/businesses/${this.purchases.businessCRF}/purchases`
    this._index.field = 'invoiceId'
    this._index.initIndex(this._index.collection,this._index.field,10)
    this._index.page$.subscribe(data => {
      this.listPuchases = data
    })

   }

  async ngOnInit(): Promise<void> {
  }

  async onCreate() {
    this._taxes.applidedTaxes = []
    this._footer.currentfoot$.next(new InvoiceFooter())
  }

  async listStores() {
    await this._stores.listenAll().subscribe(stores => {
      this.stores = stores;
    })
  }

  async findProvider(crf: string) {
    console.log(this._provider.findProviderByCRF(crf))
  }

  async getProviders(){
    await this._provider.getAll().subscribe(provider => {
      this.providers = provider
    })
  }

  onClose(){
    this.conceptInvoice.details$.next([])
    this.conceptInvoice.details_Notes$.next([])
    this.conceptInvoice.details_invoice$.next([])
    this._footer.currentfoot$.next(null)
    this.providerServ.providerSelect$.next(null)
  }

}
