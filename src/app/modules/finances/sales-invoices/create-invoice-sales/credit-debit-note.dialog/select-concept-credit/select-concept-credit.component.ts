import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { iProductInvoice, ProductInvoiceModel } from 'src/app/modules/finances/invoices/invoice.model';
import Swal from 'sweetalert2';
import { SalesInvoiceModel } from '../../../sales-invoice.model';

@Component({
  selector: 'app-select-concept-credit',
  templateUrl: './select-concept-credit.component.html',
  styleUrls: ['./select-concept-credit.component.scss']
})
export class SelectConceptCreditComponent implements OnInit {

  concepts: iProductInvoice[] = []
  constructor(
    @Inject(MAT_DIALOG_DATA) public invoice: SalesInvoiceModel
  ) { }

  ngOnInit(): void {
  }

  addProduct(event: MatCheckboxChange, concept: iProductInvoice) {
    if (event.checked) {
      this.concepts.push(concept);
    } else {
      this.concepts= this.concepts.filter(c => c.UPC != concept.UPC)
    }
  }

  goCreditNote(){
    
  }

}
