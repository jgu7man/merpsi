import { Component, Input, OnInit } from '@angular/core';
import { SalesInvoiceReadingModel } from '../sales-invoice.model';

@Component({
  selector: 'app-linked-documents',
  templateUrl: './linked-documents.component.html',
  styleUrls: ['./linked-documents.component.scss']
})
export class LinkedDocumentsComponent implements OnInit {

  @Input() linked_documents?: SalesInvoiceReadingModel 

  construct(){

  }

  ngOnInit(): void {
  }

}
