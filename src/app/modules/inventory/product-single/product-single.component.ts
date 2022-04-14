import { Component, OnInit } from '@angular/core';
import { CurrentProductService } from './current-product.service';

@Component({
  selector: 'app-product-single',
  templateUrl: './product-single.component.html',
  styleUrls: ['./product-single.component.scss']
})
export class ProductSingleComponent implements OnInit {

  constructor (
    public current: CurrentProductService
  ) { }

  ngOnInit(): void {
  }

}
