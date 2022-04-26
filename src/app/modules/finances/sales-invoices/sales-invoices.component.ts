import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { SalesInvoiceModel } from 'src/app/modules/finances/sales-invoices/sales-invoice.model';
import { AuthService } from 'src/app/services/auth.service';
import { ManagerModel } from '../../admin/managers/manager.model';
import { SalesService } from './sales.service';

@Component({
  selector: 'app-sales-invoices',
  templateUrl: './sales-invoices.component.html',
  styleUrls: ['./sales-invoices.component.scss']
})
export class SalesInvoicesComponent implements OnInit {

  constructor(
    public sales: SalesService,
    private _auth: AuthService,
    private _dashboard: DashboardService
  ) { } 

  ngOnInit(): void {
  }


  async onCreate(){
    this.sales.current$.next(new SalesInvoiceModel());
    let user = this._auth.userState$.value
    if (!user) throw {message: 'No se ha iniciado sesión'}
      this.sales.updateCurrent('manager', user!.name)
    
  }

}
