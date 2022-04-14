import { Component, OnDestroy, OnInit } from '@angular/core';
import { MxCrudPanelColumns } from 'libs/@marxa/crud-panel/src/lib/mx-crud-panel.model';
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
