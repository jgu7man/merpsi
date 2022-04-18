import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { PurchaseInvoiceModel } from '../../purchase-invoices/pucharce-invoice.model';
import { PurchaseInvoiceService } from '../../purchase-invoices/puchase-invoice.service';
import { SalesInvoiceModel } from '../../sales-invoices/sales-invoice.model';
import { SalesService } from '../../sales-invoices/sales.service';

@Component({
  selector: 'app-footer-invoice',
  templateUrl: './footer-invoice.component.html',
  styleUrls: ['./footer-invoice.component.scss']
})
export class FooterInvoiceComponent implements OnInit, OnDestroy{

  private currentSubscription: Subscription

  formFooter: FormGroup = new FormGroup({
    subtotal: new FormControl( 0 ),
    discount: new FormControl( 0 ),
    //taxes: [],
    shipping:  new FormControl( 0 ),
    total:  new FormControl( 0 ),
})

  constructor(
    public purchase: PurchaseInvoiceService,
    public sales: SalesService,
  ) {
    this.disableForm()

    if (this.purchase.current$.value != null){
        this.currentSubscription = this.purchase.current$.pipe().subscribe(invoice => {
        this.getFooter(invoice!)
      })
    }else{
      this.currentSubscription = this.sales.current$.pipe().subscribe(invoice => {
        this.getFooter(invoice!)
      })
    }
   }
 
  ngOnInit(): void {
    
    this.formFooter.valueChanges.pipe(
      distinctUntilChanged((x, y) =>
          typeof x != 'object' ? x === y : JSON.stringify(x) === JSON.stringify(y)
        ),
        skip( 1),
        debounceTime(3000),
    ).subscribe(changes => {
      if ( this.purchase.current$.value ){
        let footer = this.purchase.current$.value.footer
        let discount = changes.discount
        let shipping = changes.shipping
        this.purchase.updateCurrent('footer', {...footer, discount: discount, shipping: shipping}
        )
      }else 
      if(this.sales.current$.value){
        let footer = this.sales.current$.value.footer
        let discount = changes.discount
        let shipping = changes.shipping
        this.sales.updateCurrent('footer', {...footer, discount: discount, shipping: shipping}
        )
      }
      
    })

  }

  disableForm(){
    this.formFooter.controls.subtotal.disable()
    this.formFooter.controls.total.disable()
  }

  getFooter(invoice: PurchaseInvoiceModel | SalesInvoiceModel){
    let subtotal = 0
        if (invoice){
          invoice.details.forEach( d => subtotal += d.amount)
          invoice.footer.subtotal = subtotal
          invoice.footer.total = (invoice.footer.shipping + invoice.footer.subtotal) - invoice.footer.discount
          this.formFooter.patchValue({
            subtotal : subtotal,
            total:  invoice.footer.total
          })
        }
  }

  ngOnDestroy(): void {
    this.currentSubscription.unsubscribe()
  }

}
