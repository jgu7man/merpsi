import { Component, OnInit } from '@angular/core';
import { CurrentProductService } from '../current-product.service';

@Component({
  selector: 'app-product-storage',
  templateUrl: './product-storage.component.html',
  styleUrls: ['./product-storage.component.scss']
})
export class ProductStorageComponent implements OnInit {

  constructor (
    public current: CurrentProductService
  ) { 
  }

  ngOnInit(): void {
  }

}
