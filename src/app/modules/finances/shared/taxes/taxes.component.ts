import { Component, OnDestroy, OnInit } from '@angular/core';
import { MxCrudPanelColumns } from '@marxa/crud-panel';
import { TaxesService } from './taxes.service';

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.scss']
})
export class TaxesComponent implements OnInit, OnDestroy {

  readonly columns: MxCrudPanelColumns[] = [
    { id: 'name', displayName: 'Impuesto' },
    { id: 'rate', displayName: 'Tasa' }
  ]

  constructor (
    public taxes: TaxesService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.taxes.leave()
  }

}
