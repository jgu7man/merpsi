import { Component, OnInit } from '@angular/core';
import { MxLoading } from '@marxa/devkit';
import { first } from 'rxjs/operators';

@Component({
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  public activeLink: string = 'list'

  constructor (
    
    private _loading: MxLoading
  ) {
    this._loading.getCurrentActivatedRoute()
      .pipe( first() )
      .subscribe( routeTail => {
        this.activeLink = routeTail.snapshot.routeConfig?.path || 'list'
    })
  }

  ngOnInit(): void {
  }

  

}
