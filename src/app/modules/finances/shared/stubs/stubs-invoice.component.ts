import { Component, OnInit } from '@angular/core';
import { StubService } from './stub.service';

@Component({
  selector: 'app-stubs-invoice',
  templateUrl: './stubs-invoice.component.html',
  styleUrls: ['./stubs-invoice.component.scss']
})
export class StubsInvoiceComponent implements OnInit {

  constructor(
    public stub: StubService
  ) { }

  ngOnInit(): void {
  }

}
