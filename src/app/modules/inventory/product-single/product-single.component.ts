import { Component, OnInit } from '@angular/core';
import { MxAlert, MxCache } from '@marxa/devkit';
import { MenuItem } from 'primeng/api';
import { CountingsService } from '../countings/countings.service';
import { CurrentProductService } from './current-product.service';

@Component({
  selector: 'app-product-single',
  templateUrl: './product-single.component.html',
  styleUrls: ['./product-single.component.scss']
})
export class ProductSingleComponent implements OnInit {



  constructor (
    public current: CurrentProductService,
    public counting: CountingsService,
    private _alert: MxAlert
  ) {

  }

  ngOnInit(): void {
  }



}
