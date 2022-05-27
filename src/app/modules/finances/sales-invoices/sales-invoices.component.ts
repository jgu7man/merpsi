import { Component, OnInit } from '@angular/core';
import { SalesInvoiceModel } from 'src/app/modules/finances/sales-invoices/sales-invoice.model';
import { AuthService } from 'src/app/services/auth.service';
import { iStub } from '../stubs-invoice/stub.model';
import { StubService } from '../stubs-invoice/stub.service';
import { TaxesService } from '../taxes/taxes.service';
import { SalesService } from './sales.service';

@Component({
  selector: 'app-sales-invoices',
  templateUrl: './sales-invoices.component.html',
  styleUrls: ['./sales-invoices.component.scss']
})
export class SalesInvoicesComponent implements OnInit {

  listInvoice: SalesInvoiceModel[] = []


  constructor(
    public sales: SalesService,
    private _auth: AuthService,
    private _stub: StubService,
    private _taxes: TaxesService
    ) 
    {
    this.sales.listInvoice().subscribe(invoice => this.listInvoice = invoice);
    console.log(this.listInvoice);
  }

  ngOnInit(): void {
  }


  async onCreate() {
   // this.sales.current$.next(new SalesInvoiceModel());
    let user = this._auth.userState$.value
    if (!user) throw { message: 'No se ha iniciado sesión' }
    this.sales.updateCurrent('manager', user!.name)
    this._stub.list$.pipe(
      ).subscribe( list => {
        let stubList: iStub[] = []
        list.forEach(d => {
            if (d.active && d.currentIndex < d.endIndex && d.type === 'sale') {
              stubList.push(d)
            }
          })
          this.sales.stubList$.next(stubList)
      }) 

  }

  onClose(){
    this.sales.stubList$.next([])
    this.sales.stubSelect$.next(null)
    this._taxes.leave()

  }

}
