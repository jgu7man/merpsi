import { MxAuth } from '@marxa/auth';
import { Location } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { distinctUntilChanged, mergeMap, take } from 'rxjs/operators';
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
    private route: ActivatedRoute
  ) {
    this.responsive.smallWidth = 415

    /* Suscripción a los cambios de autenticación */
    // this.userSubscription = this.auth.userState$.subscribe((state)=>{
    //   console.log(state)
    //   let eid = this.route.snapshot.params
    //   if (!eid) {
    //     if (state?.businesses.length==1){
    //       this._router.navigate(['/d/empresa',state.businesses[0]])
    //     }
    //   }
      
    // })
    this.userSubscription = this.auth.user$.pipe(
      mergeMap(() => this.auth.userState$)
    ).subscribe(user => {
      console.log(user)
      let eid = this.route.snapshot.params.id
      if (!eid) {
        if (user?.businesses.length==1){
          this._router.navigate(['/d/empresa',user.businesses[0]])
        }
      }else{
        this._cache.updateData('eid', eid)
        // let empresa = this._cache.getDataKey('eid')
      }
    })
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
