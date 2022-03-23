import { Component, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { CurrentProductService } from '../../services/current-product.service';

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
