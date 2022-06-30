import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MxAuth } from '@marxa/auth';
import { Observable } from 'rxjs';
import { iSede } from '../../stores/sede.model';
import { SedesService } from '../../stores/sedes.service';
import { ManagerModel } from '../manager.model';
import { ROL } from '../personal.model';
import { PersonalService } from '../personal.service';

@Component({
  selector: 'app-set-usuario',
  templateUrl: './set-usuario.component.html',
  styleUrls: ['./set-usuario.component.scss']
})
export class SetUsuarioComponent implements OnInit {

  @Input() usuario: ManagerModel
  roles: ROL[] = [
     'administrador' , 'gerente' , 'asesor' , 'mecanico' , 'revoke'
  ]
  sedes$: Observable<iSede[]>
  isNew: boolean = true
  hide: boolean = true
  @Output() submited: EventEmitter<any> = new EventEmitter()

  constructor(
    private _sedes: SedesService,
    private _personal: PersonalService,
    private _auth: MxAuth
  ) {
    
    this.usuario = new ManagerModel('','','','','asesor')
    this.sedes$ = this._sedes.listenAll()
  }
  
  ngOnInit(): void {
    if ( this.usuario?.email ) {
      this.isNew = false
    }
    console.log(this.usuario)

  }

  async onSubmit() {
    if (this.isNew) {
      await  this._personal.add(this.usuario)
    } else {
       this._personal.update(this.usuario)
    }
    this.submited.emit()
  }

  onRestore(): void {
    this._auth.restorePwd(this.usuario.email)
  }

}
