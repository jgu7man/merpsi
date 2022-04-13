import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { PurchaseInvoiceService } from 'src/app/services/puchase-invoice.service';

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
  ) {
    this.currentSubscription = this.purchase.current$.pipe().subscribe(invoice => {
      let subtotal = 0
      if (invoice){
        invoice.details.forEach( d => subtotal += d.amount)
         //this.purchase.updateCurrent('footer',{...invoice.footer, subtotal: subtotal})
         invoice.footer.subtotal = subtotal
         this.formFooter.patchValue({subtotal : subtotal})
          console.log('nuevo valor del current')
          console.log(invoice)
      }
    })
   }
 
  ngOnInit(): void {
    

  }

  ngOnDestroy(): void {
    this.currentSubscription.unsubscribe()
  }

}
