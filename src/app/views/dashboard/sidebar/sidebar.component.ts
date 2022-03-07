import { MxAuth } from '@marxa/auth';
import { Location } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { MxCache, MxResponsive } from '@marxa/devkit';
import { UsuarioModel } from 'src/app/models/personal.model';
import { Subscription } from 'rxjs';
import { Output } from '@angular/core';
import { PersonalService } from 'src/app/services/personal.service';
import { AuthService } from 'src/app/services/auth.service';
import { iManager } from 'src/app/models/manager.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  /** Suscripción de los cambios del usuario */
  private userSubscription: Subscription
  /** Emite un evento para que el componente del dashboard cierre el sidebar */
  @Output() closePanel: EventEmitter<any> = new EventEmitter()

  constructor (
    public auth: AuthService,
    public location: Location,
    public responsive: MxResponsive,
    private _router: Router,
    private _cache: MxCache,
    private _personal: PersonalService,
  ) {
    this.responsive.smallWidth = 415

    /* Suscripción a los cambios de autenticación */
    this.userSubscription = this.auth.user$.subscribe()
  }

  ngOnInit(): void {
  }

  get href() {
    return window.location.href
  }

  get isLocalhost() {
    return this.href.includes('localhost')
  }

  onActive(path: string) {
    return this.location.path().includes(path)
  }

  signOut() {
    this.auth.signOut()
    this._router.navigate(['/login'])
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe()
  }

  

}
