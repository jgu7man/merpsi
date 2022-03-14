import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './delete-sede.dialog.html',
  styleUrls: ['./delete-sede.dialog.scss']
})
export class DeleteSedeDialog implements OnInit {

  constructor(
    public dialog: MatDialogRef<DeleteSedeDialog>
  ) { }

  ngOnInit(): void {
  }

}
