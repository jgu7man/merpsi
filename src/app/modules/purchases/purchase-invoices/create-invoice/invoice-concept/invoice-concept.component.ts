import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FireDoc } from 'src/app/models/firestore.model';
import { ProductInvoiceModel } from 'src/app/models/products.model';

@Component({
  selector: 'app-invoice-concept',
  templateUrl: './invoice-concept.component.html',
  styleUrls: ['./invoice-concept.component.scss']
})
export class InvoiceConceptComponent implements OnInit {

  @Input() concept: FireDoc<ProductInvoiceModel> | null = null

  formAddProduct: FormGroup = new FormGroup({
    product: new FormControl('', [Validators.required]),
    cant: new FormControl('', [Validators.required]),
    unit_cost: new FormControl('', [Validators.required]),
  })

  constructor() { }

  ngOnInit(): void {
    if (this.concept) {
      this.formAddProduct.patchValue(this.concept)
      this.formAddProduct.markAsPristine()
    }

  }



}
