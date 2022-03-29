import { Component, OnInit } from '@angular/core';
import { ProviderModel } from 'src/app/models/provider.model';
import { iSede } from 'src/app/models/sede.model';
import { ProviderService } from 'src/app/services/provider.service';
import { PurchaseInvoiceService } from 'src/app/services/puchase-invoice.service';
import { SedesService } from '../../admin/sedes/sedes.service';

@Component({
  selector: 'app-purchase-invoices',
  templateUrl: './purchase-invoices.component.html',
  styleUrls: ['./purchase-invoices.component.scss']
})
export class PurchaseInvoicesComponent implements OnInit {

  providers: ProviderModel[] = [];
  stores: iSede[] = [];

  
  constructor(
    private _provider: ProviderService,
    private _stores : SedesService,
    public purchases: PurchaseInvoiceService
  ) { }

  async ngOnInit(): Promise<void> {
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

}
