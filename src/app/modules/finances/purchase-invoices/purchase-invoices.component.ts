import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { PurchaseInvoiceModel } from 'src/app/modules/finances/purchase-invoices/pucharce-invoice.model';
import { AuthService } from 'src/app/services/auth.service';
import { ManagerModel } from '../../admin/managers/manager.model';
import { iSede } from '../../admin/stores/sede.model';
import { SedesService } from '../../admin/stores/sedes.service';
import { ProviderModel } from '../../inventory/providers/provider.model';
import { ProviderService } from '../../inventory/providers/provider.service';
import { PurchaseInvoiceService } from './puchase-invoice.service';

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
    public purchases: PurchaseInvoiceService,
    private _auth: AuthService,
    private _dashboard: DashboardService


  ) { }

  async ngOnInit(): Promise<void> {
  }
  get managerRef() {
    let user = this._auth.userState$.value
    if (!user) throw {message: 'No se ha iniciado sesión'}
    let userRef = this._dashboard.businessRef
      .collection( 'managers' )
      .doc<ManagerModel>( user.uid )
      .ref
    return userRef
  }
  async onCreate() {
    this.purchases.current$.next(new PurchaseInvoiceModel())
    let manager= (await this.managerRef.get()).data()
    if (manager){
      this.purchases.updateCurrent('manager', manager!.name)
    }
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
