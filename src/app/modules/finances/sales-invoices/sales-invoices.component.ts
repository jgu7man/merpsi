import { Component, OnInit } from '@angular/core';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { SalesInvoiceModel, SalesInvoiceReadingModel } from 'src/app/modules/finances/sales-invoices/sales-invoice.model';
import { AuthService } from 'src/app/services/auth.service';
import { iStub } from '../stubs-invoice/stub.model';
import { StubService } from '../stubs-invoice/stub.service';
import { TaxesService } from '../taxes/taxes.service';
import { SalesService } from './sales.service';
import { map, skip } from 'rxjs/operators'

@Component({
  selector: 'app-sales-invoices',
  templateUrl: './sales-invoices.component.html',
  styleUrls: ['./sales-invoices.component.scss']
})
export class SalesInvoicesComponent implements OnInit {

  listInvoice: SalesInvoiceReadingModel[] = []


  constructor(
    public sales: SalesService,
    private _auth: AuthService,
    private _stub: StubService,
    private _taxes: TaxesService,
    private _cache: MxCache,
    ) 
    {
    this.sales.listInvoice().pipe(
      // map(result => {
      //   let invoiceReadingList:SalesInvoiceReadingModel[] = []
      //   result.forEach(doc =>{
      //    let invoiceReading=  new SalesInvoiceReadingModel(doc,this._cache.getDataKey( 'eid' )! )
      //    invoiceReadingList.push(invoiceReading)
      //   })
      //   return invoiceReadingList
    //  0})
    ).subscribe(invoice => {
        this.listInvoice = invoice
        console.log(this.listInvoice);
    });
  }

  ngOnInit(): void {
  }


  async onCreate() {
   // this.sales.current$.next(new SalesInvoiceModel());
    let user = this._auth.userState$.value
    if (!user) throw { message: 'No se ha iniciado sesión' }
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
