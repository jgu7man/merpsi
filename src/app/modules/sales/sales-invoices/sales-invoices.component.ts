import { Component, OnInit } from '@angular/core';
import { SalesInvoiceModel } from 'src/app/models/sales-invoice.model';
import { SalesService } from 'src/app/services/sales.service';

@Component({
  selector: 'app-sales-invoices',
  templateUrl: './sales-invoices.component.html',
  styleUrls: ['./sales-invoices.component.scss']
})
export class SalesInvoicesComponent implements OnInit {

  constructor(
    public sales: SalesService
  ) { } 

  ngOnInit(): void {
  }

  onCreate(){
    this.sales.current$.next(new SalesInvoiceModel());
  }
}
