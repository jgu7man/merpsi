import { Component, OnDestroy, OnInit } from '@angular/core';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { SalesInvoiceReadingModel } from 'src/app/modules/finances/sales-invoices/sales-invoice.model';
import { AuthService } from 'src/app/services/auth.service';
import { iStub } from '../shared/stubs/stub.model';
import { SalesService } from './sales.service';
import { MxIndex } from 'libs/@marxa/index/src/lib/mx-index.service';
import { Subscription } from 'rxjs';
import { mxIndexCenterMessage } from 'libs/@marxa/index/src/public-api';
import { FooterService } from '../shared/footer-invoice/footer.service';
import { StubService } from '../shared/stubs/stub.service';
import { TaxesService } from '../shared/taxes/taxes.service';

@Component({
  selector: 'app-sales-invoices',
  templateUrl: './sales-invoices.component.html',
  styleUrls: ['./sales-invoices.component.scss']
})
export class SalesInvoicesComponent implements OnInit, OnDestroy {

  listInvoice: SalesInvoiceReadingModel[] = []
  listSubscription: Subscription
  centerMessage: mxIndexCenterMessage ={
    showing: 'Mostrando',
    from: 'del',
    to: 'al'
  }

  constructor(
    public sales: SalesService,
    private _auth: AuthService,
    private _stub: StubService,
    private _taxes: TaxesService,
    private _cache: MxCache,
    private _index: MxIndex,
    private _footer: FooterService

    ) 
    {
    // this.sales.listInvoice().pipe(
    // ).subscribe(invoice => {
    //     this.listInvoice = invoice
    //     console.log(this.listInvoice);
    // });
    this._index.collection = `businesses/${this.sales.businessCRF}/sales`
    this._index.field = 'invoiceId'
    this._index.queryCant = 10
    this._index.initIndex( this._index.collection, this._index.field, 10, 'asc' )
    this.listSubscription =
      this._index.page$.subscribe( data => {
        let invoiceReadingList:SalesInvoiceReadingModel[] = []
        data.map(s => {
            let invoiceReading=  new SalesInvoiceReadingModel(s,this._cache.getDataKey( 'eid' )! )
            return invoiceReadingList.push(invoiceReading);
          });
        this.listInvoice = invoiceReadingList
        //this.products = data as CatalogProductModel[]
      } )

    
  }
  ngOnDestroy(): void {
    this.listSubscription.unsubscribe()
  }

  ngOnInit(): void {
  }


  async onCreate() {
   // this.sales.current$.next(new SalesInvoiceModel());
    let user = this._auth.userState$.value
    if (!user) throw { message: 'No se ha iniciado sesión' }
    

  }

  onClose(){
    this.sales.stubList$.next([])
    this.sales.stubSelect$.next(null)
    this._taxes.leave()
    this._footer.currentfoot$.next(null)
    this._footer.currentfoot_invoice$.next(null)


  }

}
