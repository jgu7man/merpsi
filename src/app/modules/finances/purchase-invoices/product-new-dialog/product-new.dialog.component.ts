import { Component, OnInit } from '@angular/core';
import { CurrentProductService } from 'src/app/modules/inventory/product-single/current-product.service';
import { Product, ProductModel } from 'src/app/modules/inventory/products/products.model';


@Component({
  selector: 'app-product-new',
  templateUrl: './product-new.dialog.component.html',
  styleUrls: ['./product-new.dialog.component.scss']
})
export class ProductNewDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
