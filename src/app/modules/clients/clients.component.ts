import { Component, OnInit } from '@angular/core';
import { ClientModel } from 'src/app/models/clients.model';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  clients: ClientModel[] = []
  constructor() { }

  ngOnInit(): void {
  }

  onDeleteItem(event: Event): void {

  }

}
