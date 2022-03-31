import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-client',
  templateUrl: './delete-client.component.html',
  styleUrls: ['./delete-client.component.scss']
})
export class DeleteClientComponent implements OnInit {

  constructor(
    public dialog: MatDialogRef<DeleteClientComponent>
  ) { }

  ngOnInit(): void {
  }

}
