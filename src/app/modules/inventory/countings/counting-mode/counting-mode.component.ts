import { Component, OnInit } from '@angular/core';
import { CurrentProductService } from '../../product-single/current-product.service';

@Component({
  selector: 'app-counting-mode',
  templateUrl: './counting-mode.component.html',
  styleUrls: ['./counting-mode.component.scss']
})
export class CountingModeComponent implements OnInit {

  constructor (
    public current: CurrentProductService
  ) { }

  ngOnInit(): void {
  }


}
