import { Component, Input, OnInit } from '@angular/core';
import { PurchaseInvoiceModel } from '../pucharce-invoice.model';

@Component({
  selector: 'app-select-puchase',
  templateUrl: './select-puchase.component.html',
  styleUrls: ['./select-puchase.component.scss']
})
export class SelectPuchaseComponent implements OnInit {

  constructor() { }

  @Input() invoice: PurchaseInvoiceModel | null = null

  ngOnInit(): void {
  }

}
