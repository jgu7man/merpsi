import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ClientModel } from 'src/app/models/clients.model';
import { ClientsService } from './clients.service';
import { DeleteClientComponent } from './delete-client/delete-client.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  clients: ClientModel[] = []
  constructor(
    private _dialog: MatDialog,
    private _client: ClientsService
  ) {
      this._client.getAll().subscribe(client => {
      this.clients = client
  })
   }

  ngOnInit(): void {
    
  }

  onDeleteItem(item: ClientModel): void {
    this._dialog.open(DeleteClientComponent)
    .afterClosed().subscribe(confirmation => {
      if (confirmation) {
      this._client.delete(item)
    }
  })
  }

}
