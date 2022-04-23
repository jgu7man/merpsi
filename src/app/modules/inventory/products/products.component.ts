import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  public activeLink: string = 'list'

  constructor (
    
  ) {
    
   }

  ngOnInit(): void {
  }

  

}
