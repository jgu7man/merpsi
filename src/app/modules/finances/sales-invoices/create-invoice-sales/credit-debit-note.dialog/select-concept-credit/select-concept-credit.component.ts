import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductInvoiceModel } from 'src/app/modules/finances/shared/invoice.model';
import Swal from 'sweetalert2';
import { SalesInvoiceModel } from '../../../sales-invoice.model';

@Component({
  selector: 'app-select-concept-credit',
  templateUrl: './select-concept-credit.component.html',
  styleUrls: ['./select-concept-credit.component.scss']
})
export class SelectConceptCreditComponent implements OnInit {

  concepts: ProductInvoiceModel[] = []
  constructor(
    @Inject(MAT_DIALOG_DATA) public invoice: SalesInvoiceModel
  ) { }

  ngOnInit(): void {
  }

  addProduct(event: MatCheckboxChange, concept: ProductInvoiceModel) {
    if (event.checked) {
      this.concepts.push(concept);
    } else {
      this.concepts= this.concepts.filter(c => c.product.UPC != concept.product.UPC)
    }
  }

  goCreditNote(){
    
  }

}
