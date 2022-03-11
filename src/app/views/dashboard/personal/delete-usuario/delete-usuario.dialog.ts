import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './delete-usuario.dialog.html',
  styleUrls: ['./delete-usuario.dialog.scss']
})
export class DeleteUsuarioDialog implements OnInit {

  constructor(
    public dialog: MatDialogRef<DeleteUsuarioDialog>
  ) { }

  ngOnInit(): void {
  }

}
