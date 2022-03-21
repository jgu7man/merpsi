import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
=======
import { MatDialog } from '@angular/material/dialog';
import { ProviderModel } from 'src/app/models/provider.model';
import Swal from 'sweetalert2';
import { ProviderService } from './provider.service';
>>>>>>> mari

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent implements OnInit {

<<<<<<< HEAD
  constructor() { }
=======
  providers: ProviderModel[] = [];
  constructor(
    private _provider: ProviderService,
    private _dialog: MatDialog
  ) {

    this._provider.getAll().subscribe(provider => {
        this.providers = provider
    })
   }
>>>>>>> mari

  ngOnInit(): void {
  }

<<<<<<< HEAD
=======
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

>>>>>>> mari
}
