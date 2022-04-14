import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import Swal from 'sweetalert2';
import { ProviderModel } from './provider.model';
import { ProviderService } from './provider.service';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent implements OnInit {

  providers: ProviderModel[] = [];
  businessRef = this._cache.getDataKey('eid')
  constructor(
    private _provider: ProviderService,
    private _dialog: MatDialog,
    private _cache: MxCache,
  ) {

    this._provider.getAll().subscribe(provider => {
        this.providers = provider
    })
   }

  ngOnInit(): void {
  }

  async onDeleteItem(item: ProviderModel) {
    Swal.fire({
      text: "Estas seguro de querer eliminar este proveedor?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this._provider.delete(item)
      }
    })
  }

}
