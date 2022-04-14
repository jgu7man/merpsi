import { Location } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MxResponsive } from 'libs/@marxa/devkit/responsive/mx-responsive.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { PersonalService } from 'src/app/modules/admin/managers/personal.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  
  public eid?: string;
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
    this.userSubscription = this.auth.authUser$.pipe(
      mergeMap(() => this.auth.userState$)
    ).subscribe(user => {
      console.log( this.route.snapshot.params )
      let eid = this.route.snapshot.params.eid
      if (!eid) {
        if (user?.businesses.length==1){
          this._router.navigate(['/',user.businesses[0]])
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
