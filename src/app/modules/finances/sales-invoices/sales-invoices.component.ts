import { Component, OnInit } from '@angular/core';
import { SalesInvoiceModel } from 'src/app/modules/finances/sales-invoices/sales-invoice.model';
import { AuthService } from 'src/app/services/auth.service';
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
  ) { } 

  ngOnInit(): void {
  }

  onCreate(){
    this.sales.current$.next(new SalesInvoiceModel());
    let manager= this._auth.userState$.value!.name
    this.sales.updateCurrent('manager', manager)
  }
}
